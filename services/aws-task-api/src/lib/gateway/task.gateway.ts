import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';

import { resourceNames } from '../../constants/resources';

export class TaskAPIGateway extends gateway.RestApi {
  constructor(scope: cdk.Stack) {
    const params: gateway.RestApiProps = {
      restApiName: resourceNames.taskApiGateway,
    };

    super(scope, resourceNames.taskApiGateway, params);
  }
}
