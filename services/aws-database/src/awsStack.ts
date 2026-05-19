import * as cdk from 'aws-cdk-lib';

import { PostgresRdsStack } from './lib/rds/postgresDB';

const app = new cdk.App();

new PostgresRdsStack(app);
