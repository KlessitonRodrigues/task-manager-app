import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';

import { resourceNames } from '../../../constants/resources';
import { environment } from '../../../utils/lambda';

const nodeModules = ['dynamoose', 'zod'];

const entry = __dirname + '/task.service.ts';
const runtime = lambda.Runtime.NODEJS_22_X;
const timeout = cdk.Duration.seconds(10);

export class FindAllTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, environment: environment, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.findAllTaskLambda, {
      runtime,
      timeout,
      entry,
      environment,
      logGroup,
      handler: 'findAllTaskService',
      functionName: resourceNames.findAllTaskLambda,
      bundling: { environment, nodeModules },
    });
  }
}

export class FindOneTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, environment: environment, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.findOneTaskLambda, {
      runtime,
      timeout,
      entry,
      environment,
      logGroup,
      handler: 'findOneTaskService',
      functionName: resourceNames.findOneTaskLambda,
      bundling: { environment, nodeModules },
    });
  }
}

export class CreateTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, environment: environment, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.createTaskLambda, {
      runtime,
      timeout,
      entry,
      environment,
      logGroup,
      handler: 'createTaskService',
      functionName: resourceNames.createTaskLambda,
      bundling: { environment, nodeModules },
    });
  }
}

export class UpdateTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, environment: environment, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.updateTaskLambda, {
      runtime,
      timeout,
      entry,
      environment,
      logGroup,
      handler: 'updateTaskService',
      functionName: resourceNames.updateTaskLambda,
      bundling: { environment, nodeModules },
    });
  }
}

export class DeleteTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, environment: environment, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.deleteTaskLambda, {
      runtime,
      timeout,
      entry,
      logGroup,
      environment,
      handler: 'deleteTaskService',
      functionName: resourceNames.deleteTaskLambda,
      bundling: { environment, nodeModules },
    });
  }
}
