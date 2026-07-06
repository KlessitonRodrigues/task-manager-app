import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';

import { lambdaPackages, resourceNames } from '../../../constants/resources';
import { LambdaEnv } from '../../../stask';

export class FindAllTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, lambdaEnv: LambdaEnv, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.findAllTaskLambda, {
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      handler: 'findAllTaskService',
      functionName: resourceNames.findAllTaskLambda,
      entry: __dirname + '/task.service.ts',
      environment: lambdaEnv,
      logGroup,
      bundling: { environment: lambdaEnv, nodeModules: lambdaPackages },
    });
  }
}

export class FindOneTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, lambdaEnv: LambdaEnv, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.findOneTaskLambda, {
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      handler: 'findOneTaskService',
      functionName: resourceNames.findOneTaskLambda,
      entry: __dirname + '/task.service.ts',
      environment: lambdaEnv,
      logGroup,
      bundling: { environment: lambdaEnv, nodeModules: lambdaPackages },
    });
  }
}

export class CreateTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, lambdaEnv: LambdaEnv, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.createTaskLambda, {
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      handler: 'createTaskService',
      functionName: resourceNames.createTaskLambda,
      entry: __dirname + '/task.service.ts',
      environment: lambdaEnv,
      logGroup,
      bundling: { environment: lambdaEnv, nodeModules: lambdaPackages },
    });
  }
}

export class UpdateTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, lambdaEnv: LambdaEnv, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.updateTaskLambda, {
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      handler: 'updateTaskService',
      functionName: resourceNames.updateTaskLambda,
      entry: __dirname + '/task.service.ts',
      environment: lambdaEnv,
      logGroup,
      bundling: { environment: lambdaEnv, nodeModules: lambdaPackages },
    });
  }
}

export class DeleteTaskLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, lambdaEnv: LambdaEnv, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.deleteTaskLambda, {
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      handler: 'deleteTaskService',
      functionName: resourceNames.deleteTaskLambda,
      entry: __dirname + '/task.service.ts',
      environment: lambdaEnv,
      logGroup,
      bundling: { environment: lambdaEnv, nodeModules: lambdaPackages },
    });
  }
}
