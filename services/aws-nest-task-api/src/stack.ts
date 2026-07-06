import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';

import { addCorsPreflight } from './utils/preflightResponse';

export const stackName = 'NestApiStack';

const lambdaPackages = [
  '@nestjs/core',
  '@nestjs/common',
  '@nestjs/platform-express',
  '@codegenie/serverless-express',
  'reflect-metadata',
  'dynamoose',
  'nestjs-zod',
  'rxjs',
  'zod',
];

type LambdaEnv = { [key: string]: string };

class NestApiLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, lambdaEnv: LambdaEnv, logGroup?: cdk.aws_logs.LogGroup) {
    const params: nodeLambda.NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_24_X,
      memorySize: cdk.Size.mebibytes(512).toMebibytes(),
      timeout: cdk.Duration.seconds(10),
      handler: 'handler',
      functionName: `${stackName}-lambda`,
      entry: __dirname + '/lambda.ts',
      environment: lambdaEnv,
      logGroup,
      bundling: { environment: lambdaEnv, nodeModules: lambdaPackages },
    };
    super(scope, `${stackName}-lambda`, params);
  }
}

class NestApiGateway extends gateway.RestApi {
  constructor(scope: cdk.Stack) {
    const params: gateway.RestApiProps = {
      restApiName: `${stackName}-apigateway`,
    };
    super(scope, `${stackName}-apigateway`, params);
  }
}

class TaskTable {
  public table: dynamodb.Table;
  constructor(scope: cdk.Stack, stackName: string) {
    this.table = new dynamodb.Table(scope, `${stackName}-task-table`, {
      tableName: `${stackName}-task-table`,
      partitionKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

export class NestApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const taskTable = new TaskTable(this, stackName);

    // Log Group
    const logGroup = new cdk.aws_logs.LogGroup(this, `${stackName}-log-group`, {
      logGroupName: `${stackName}-log-group`,
      retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda Functions
    const lambdaEnv: LambdaEnv = {
      TASK_TABLE_NAME: taskTable.table.tableName,
    };

    const nestApiLambda = new NestApiLambda(this, lambdaEnv, logGroup);
    taskTable.table.grantReadWriteData(nestApiLambda);

    // API Gateway
    const apiGateway = new NestApiGateway(this);

    // API Routes
    const taskRoute = apiGateway.root.addResource('task');
    // Create a new task
    taskRoute.addMethod('POST', new gateway.LambdaIntegration(nestApiLambda));
    // List all tasks
    taskRoute.addMethod('GET', new gateway.LambdaIntegration(nestApiLambda));
    // Get a task by ID
    const taskIdRoute = taskRoute.addResource('{id}');
    taskIdRoute.addMethod('GET', new gateway.LambdaIntegration(nestApiLambda));
    // Update a task by ID
    taskIdRoute.addMethod('PUT', new gateway.LambdaIntegration(nestApiLambda));
    // Delete a task by ID
    taskIdRoute.addMethod('DELETE', new gateway.LambdaIntegration(nestApiLambda));

    // Permissions
    taskTable.table.grantReadWriteData(nestApiLambda);

    // API Preflight
    addCorsPreflight(taskRoute);
  }
}

const app = new cdk.App();
new NestApiStack(app, 'NestApiStack');
