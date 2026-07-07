import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import { resourceNames } from '../../constants/resources';

export class TaskTable {
  public table: dynamodb.Table;

  constructor(scope: cdk.Stack) {
    this.table = new dynamodb.Table(scope, resourceNames.taskTable, {
      tableName: resourceNames.taskTable,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
