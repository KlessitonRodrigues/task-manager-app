import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';

import dotenv from './constants/dotenv';
import { resourceNames } from './constants/resources';
import { TaskTable } from './lib/dynamodb/task.table';
import { TaskAPIGateway } from './lib/gateway/task.gateway';
import * as TaskLambdas from './lib/lambda/tasks/task.lambda';
import { addCorsPreflight } from './utils/aws';

export type environment = { [key: string]: string };

export class NodeTemplateStack extends cdk.Stack {
  constructor(scope: cdk.App, props?: cdk.StackProps) {
    super(scope, dotenv.STACK_NAME, props);

    // DynamoDB
    const taskTable = new TaskTable(this);

    // Log Group
    const logGroup = new cdk.aws_logs.LogGroup(this, resourceNames.logGroup, {
      logGroupName: resourceNames.logGroup,
      retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda Functions
    const lambdaEnv: environment = {
      STACK_NAME: dotenv.STACK_NAME,
      TASK_TABLE_NAME: taskTable.table.tableName,
    };

    const createTaskLambda = new TaskLambdas.CreateTaskLambda(this, lambdaEnv, logGroup);
    const findAllTaskLambda = new TaskLambdas.FindAllTaskLambda(this, lambdaEnv, logGroup);
    const findOneTaskLambda = new TaskLambdas.FindOneTaskLambda(this, lambdaEnv, logGroup);
    const updateTaskLambda = new TaskLambdas.UpdateTaskLambda(this, lambdaEnv, logGroup);
    const deleteTaskLambda = new TaskLambdas.DeleteTaskLambda(this, lambdaEnv, logGroup);

    // API Gateway
    const taskApi = new TaskAPIGateway(this);

    // API Routes
    // /token
    const tokenRoute = taskApi.root.addResource('token');
    tokenRoute.addMethod('POST', new gateway.LambdaIntegration(createTaskLambda));
    tokenRoute.addMethod('GET', new gateway.LambdaIntegration(findAllTaskLambda));
    tokenRoute.addMethod('PUT', new gateway.LambdaIntegration(updateTaskLambda));

    // /token/{id}
    const tokenIdRoute = tokenRoute.addResource('{id}');
    tokenIdRoute.addMethod('GET', new gateway.LambdaIntegration(findOneTaskLambda));
    tokenIdRoute.addMethod('DELETE', new gateway.LambdaIntegration(deleteTaskLambda));

    // Permissions
    taskTable.table.grantReadWriteData(createTaskLambda);
    taskTable.table.grantReadWriteData(findAllTaskLambda);
    taskTable.table.grantReadWriteData(findOneTaskLambda);
    taskTable.table.grantReadWriteData(updateTaskLambda);
    taskTable.table.grantReadWriteData(deleteTaskLambda);

    // API Preflight
    addCorsPreflight(tokenRoute);
  }
}

const app = new cdk.App();

new NodeTemplateStack(app);
