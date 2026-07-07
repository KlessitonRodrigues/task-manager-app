import dotenv from './dotenv';

export const resourceNames = {
  taskTable: dotenv.STACK_NAME + '-task-table',
  taskApiGateway: dotenv.STACK_NAME + '-task-api-gateway',
  logGroup: dotenv.STACK_NAME + '-log-group',
  findAllTaskLambda: dotenv.STACK_NAME + '-find-all-task-lambda',
  findOneTaskLambda: dotenv.STACK_NAME + '-find-one-task-lambda',
  createTaskLambda: dotenv.STACK_NAME + '-create-task-lambda',
  updateTaskLambda: dotenv.STACK_NAME + '-update-task-lambda',
  deleteTaskLambda: dotenv.STACK_NAME + '-delete-task-lambda',
};
