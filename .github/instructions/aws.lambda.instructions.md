# AWS Lambda (CDK + DynamoDB) Coding Rules

## Folder Structure

// Each feature lives under src/lib/lambda/<feature>/ with this layout

```
src/
├── config/
│   └── dotenv.ts                   # loads .env into process.env
├── constants/
│   ├── enviroment.ts               # typed env variable accessors
│   └── resources.ts                # CDK resource name constants
├── lib/
│   ├── dynamodb/
│   │   └── <feature>.table.ts      # DynamoDB Table CDK construct
│   ├── gateway/
│   │   └── <feature>.gateway.ts    # API Gateway CDK construct
│   └── lambda/
│       ├── common/
│       │   └── api.dto.ts          # shared ErrorDto and SuccessDto
│       └── <feature>/
│           ├── <feature>.model.ts  # dynamoose schema + model class
│           ├── <feature>.dto.ts    # zod schemas and DTO classes
│           ├── <feature>.service.ts # lambda handler functions
│           ├── <feature>.lambda.ts  # CDK NodejsFunction constructs
│           └── <feature>.spec.ts   # integration tests
├── utils/
│   └── lambda.ts                   # createResponse, badRequest, internalError helpers
└── stack.ts                        # CDK Stack wiring
```

// Never place model, dto, service, or spec files outside their feature folder

## Model (`<feature>.model.ts`)

// Use dynamoose.Schema to define the table shape
// Always use crypto.randomUUID() as the default for the id field
// Always set default values for required fields (status, priority, timestamps)
// Wrap the model in a class with a `public readonly model` property
// Read the table name from the dotenv constants, never hardcode it

```typescript
import * as crypto from 'crypto';
import * as dynamoose from 'dynamoose';
import dotenv from '../../../constants/enviroment';

const schema = new dynamoose.Schema({
  id: { type: String, required: true, default: () => crypto.randomUUID() },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, default: 'pending' },
  priority: { type: String, required: true, default: 'normal' },
  dueDate: { type: String },
  progressList: { type: Array, schema: [String], default: [] },
  createdAt: { type: String, required: true, default: () => new Date().toISOString() },
});

export class TaskModel {
  public readonly model = dynamoose.model('Tasks', schema, {
    tableName: dotenv.TASK_TABLE_NAME,
  });
}
```

## DTOs (`<feature>.dto.ts`)

// Define a shared `featureSchema` object with individual zod field validators
// Derive all DTO classes from that schema using createZodDto()
// Expose a static `.schema` property via createZodDto for runtime parsing
// Use `.partial()` for update DTOs — never duplicate field definitions

```typescript
import { createZodDto } from '@packages/common-resources/utils/zod';
import { z } from 'zod';

export const taskSchema = {
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.string().default('pending'),
  priority: z.string().default('normal'),
  dueDate: z.string().optional(),
  progressList: z.array(z.string()).default([]),
  createdAt: z.string(),
};

export class GetTaskResponseDto extends createZodDto(z.object({ ...taskSchema })) {}

export class CreateTaskDto extends createZodDto(
  z.object({
    name: taskSchema.name,
    description: taskSchema.description,
    status: taskSchema.status,
    priority: taskSchema.priority,
    dueDate: taskSchema.dueDate,
    progressList: taskSchema.progressList,
  }),
) {}

export class UpdateTaskDto extends createZodDto(
  z.object({ name: taskSchema.name, /* ... */ }).partial(),
) {}
```

## Service (`<feature>.service.ts`)

// Each handler is a plain exported `const` of type `APIGatewayHandler` — not a class
// Always wrap in try-catch; return `internalError(err)` in the catch block
// Validate all path parameters and request bodies with `.safeParse()` before use
// Return `badRequest(result.error.flatten())` when validation fails
// Return 404 via `createResponse(404, ErrorDto.create(...))` when a resource is not found
// Use `createResponse(200, parsed.data)` for successful responses
// Filter undefined fields before calling `model.update()` to avoid overwriting with null

```typescript
import { APIGatewayHandler, badRequest, createResponse, internalError } from '../../../utils/lambda';
import { ErrorDto, SuccessDto } from '../common/api.dto';
import { CreateTaskDto, GetTaskResponseDto, UpdateTaskDto, taskSchema } from './task.dto';
import { TaskModel } from './task.model';
import { apiMessage } from '@packages/common-resources/constants/apiMessage';

const taskModel = new TaskModel();

export const findAllTaskService: APIGatewayHandler = async () => {
  try {
    const tasks = await taskModel.model.scan().exec();
    const parsed = z.array(GetTaskResponseDto.schema).safeParse(tasks);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const createTaskService: APIGatewayHandler = async event => {
  try {
    const body = JSON.parse(event.body || '{}');
    const dtoResult = CreateTaskDto.schema.safeParse(body);
    if (!dtoResult.success) return badRequest(dtoResult.error.flatten());

    const task = await taskModel.model.create({ ...dtoResult.data });
    if ('statusCode' in task) return task;

    const parsed = GetTaskResponseDto.schema.safeParse(task);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const updateTaskService: APIGatewayHandler = async event => {
  try {
    const pkResult = taskSchema.id.safeParse(event.pathParameters?.id);
    if (!pkResult.success) return badRequest(pkResult.error.flatten());

    const body = JSON.parse(event.body || '{}');
    const dtoResult = UpdateTaskDto.schema.safeParse(body);
    if (!dtoResult.success) return badRequest(dtoResult.error.flatten());

    const task = await taskModel.model.get({ id: pkResult.data });
    if (!task) return createResponse(404, ErrorDto.create({ ...apiMessage.NOT_FOUND }));

    const updateData = Object.fromEntries(
      Object.entries(dtoResult.data).filter(([, v]) => v !== undefined),
    );
    await taskModel.model.update({ id: pkResult.data }, updateData);

    const updated = await taskModel.model.get({ id: pkResult.data });
    const parsed = GetTaskResponseDto.schema.safeParse(updated);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const deleteTaskService: APIGatewayHandler = async event => {
  try {
    const pkResult = taskSchema.id.safeParse(event.pathParameters?.id);
    if (!pkResult.success) return badRequest(pkResult.error.flatten());

    const task = await taskModel.model.get({ id: pkResult.data });
    if (!task) return createResponse(404, ErrorDto.create({ ...apiMessage.NOT_FOUND }));

    await taskModel.model.delete({ id: pkResult.data });
    return createResponse(200, SuccessDto.create({ ...apiMessage.DELETED_SUCCESSFULLY }));
  } catch (err: any) {
    return internalError(err);
  }
};
```

## Lambda Constructs (`<feature>.lambda.ts`)

// One class per CRUD operation, each extending `nodeLambda.NodejsFunction`
// All lambdas in a feature share the same `entry` file (the service file)
// Each class sets `handler` to the matching exported service function name
// Always bundle external packages (e.g., `dynamoose`, `zod`) via `bundling.nodeModules`
// Accept a `logGroup` parameter and pass it through — it is optional but always wired in the stack
// Read resource names from `resourceNames` constants — never hardcode function names

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { resourceNames } from '../../../constants/resources';
import { environment } from '../../../utils/lambda';

const nodeModules = ['dynamoose', 'zod'];
const entry = __dirname + '/task.service.ts';
const runtime = lambda.Runtime.NODEJS_22_X;
const timeout = cdk.Duration.seconds(10);

export class CreateTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, environment: environment, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.createTaskLambda, {
      runtime, timeout, entry, environment, logGroup,
      handler: 'createTaskService',
      functionName: resourceNames.createTaskLambda,
      bundling: { environment, nodeModules },
    });
  }
}
// Repeat pattern for FindAll, FindOne, Update, Delete lambdas
```

## DynamoDB Table (`lib/dynamodb/<feature>.table.ts`)

// Wrap the CDK Table construct in a class exposing `public table: dynamodb.Table`
// Always use `BillingMode.PAY_PER_REQUEST`
// Always set `removalPolicy: cdk.RemovalPolicy.DESTROY` for non-production tables
// Partition key is always `id` of type `STRING`

```typescript
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { resourceNames } from '../../constants/resources';

export class TaskTable {
  public table: dynamodb.Table;

  constructor(scope: cdk.Stack) {
    this.table = new dynamodb.Table(scope, resourceNames.taskTable, {
      tableName: resourceNames.taskTable,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
```

## API Gateway (`lib/gateway/<feature>.gateway.ts`)

// Extend `gateway.RestApi` directly
// Read the gateway name from `resourceNames`

```typescript
import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';
import { resourceNames } from '../../constants/resources';

export class TaskAPIGateway extends gateway.RestApi {
  constructor(scope: cdk.Stack) {
    super(scope, resourceNames.taskApiGateway, {
      restApiName: resourceNames.taskApiGateway,
    });
  }
}
```

## Stack (`stack.ts`)

// Wire resources in this order: DynamoDB → LogGroup → Lambdas → API Gateway → Routes → Permissions → CORS
// Always call `table.grantReadWriteData(lambda)` for every lambda that touches the table
// Always call `addCorsPreflight()` on every API Gateway resource
// Pass `lambdaEnv` (environment variables) to every lambda construct

```typescript
// /tasks
const taskRoute = taskApi.root.addResource('tasks');
taskRoute.addMethod('POST', new gateway.LambdaIntegration(createTaskLambda));
taskRoute.addMethod('GET',  new gateway.LambdaIntegration(findAllTaskLambda));

// /tasks/{id}
const taskIdRoute = taskRoute.addResource('{id}');
taskIdRoute.addMethod('GET',    new gateway.LambdaIntegration(findOneTaskLambda));
taskIdRoute.addMethod('PUT',    new gateway.LambdaIntegration(updateTaskLambda));
taskIdRoute.addMethod('DELETE', new gateway.LambdaIntegration(deleteTaskLambda));

taskTable.table.grantReadWriteData(createTaskLambda);
// ... repeat for all lambdas

addCorsPreflight(taskRoute);
addCorsPreflight(taskIdRoute);
```

## Constants

// `constants/enviroment.ts` — typed accessor object for all `process.env` variables, no logic
// `constants/resources.ts` — all CDK resource names derived from `STACK_NAME` prefix

```typescript
// enviroment.ts
const dotenv = {
  STACK_NAME: process.env.STACK_NAME || '',
  TASK_TABLE_NAME: process.env.TASK_TABLE_NAME || '',
  TEST_API_URL: process.env.TEST_API_URL || '',
};
export default dotenv;

// resources.ts
export const resourceNames = {
  taskTable:           dotenv.STACK_NAME + '-task-table-v3',
  taskApiGateway:      dotenv.STACK_NAME + '-task-api-gateway',
  logGroup:            dotenv.STACK_NAME + '-log-group',
  createTaskLambda:    dotenv.STACK_NAME + '-create-task-lambda',
  findAllTaskLambda:   dotenv.STACK_NAME + '-find-all-task-lambda',
  findOneTaskLambda:   dotenv.STACK_NAME + '-find-one-task-lambda',
  updateTaskLambda:    dotenv.STACK_NAME + '-update-task-lambda',
  deleteTaskLambda:    dotenv.STACK_NAME + '-delete-task-lambda',
};
```

## Shared Utilities (`utils/lambda.ts`)

// `createResponse(code, data, headers?)` — always includes CORS headers
// `badRequest(details)` — returns 400 with `ErrorDto` wrapping validation errors
// `internalError(err)` — logs the error and returns 500 with `ErrorDto`
// `APIGatewayHandler` — the type for all service handler functions

## Shared DTOs (`lib/lambda/common/api.dto.ts`)

// `ErrorDto` — `{ message, code?, details? }` — used for all error responses
// `SuccessDto` — `{ message, code?, data? }` — used for success messages (e.g., delete)
// Both use `createZodDto` and expose a static `.create()` factory

## Tests (`<feature>.spec.ts`)

// Must be integration tests using axios against a real running API — no mocking
// Must throw early if `TEST_API_URL` env variable is not set
// Must use `randomUUID()` to generate unique test data per run
// Must follow full CRUD lifecycle in order: create → list → get → update → delete
// Must persist the created resource `id` in a `let` variable shared across tests
// Must include validation tests for invalid input (400) and missing resources (404)
// Must always end with a cleanup test that deletes created data even if earlier tests fail
// Must include all constants and setup inside the `describe()` block

```typescript
describe('Tasks API', () => {
  const baseURL = dotenv.TEST_API_URL;
  if (!baseURL) throw new Error('missing TEST_API_URL');
  const apiClient = axios.create({ baseURL });

  const testId = randomUUID().replace(/-/g, '');
  const createTaskDto: CreateTaskDto = { name: `Test Task ${testId}`, /* ... */ };

  let createdTaskId: string;

  it('should create a new task and return 200 status', async () => {
    const response = await apiClient.post('/tasks', createTaskDto);
    expect(response.status).toBe(200);
    createdTaskId = response.data.id;
  });

  it('should return 400 status for invalid task data', async () => {
    await expect(apiClient.post('/tasks', { name: '' })).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it('should return 404 for non-existent task', async () => {
    await expect(apiClient.get(`/tasks/${randomUUID()}`)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it('should clean up any test data', async () => {
    if (!createdTaskId) return;
    await apiClient.delete(`/tasks/${createdTaskId}`).catch(() => undefined);
  });
});
```
