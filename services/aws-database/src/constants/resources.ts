export const stackName = 'task-manager-db';

export const resourceNames = {
  VPC_NAME: stackName + '-vpc',
  SECURITY_GROUP: stackName + '-db-security-group',
  DATABASE_ID: stackName + '-postgres-db',
  DATABASE_ENDPOINT_OUTPUT: stackName + '-db-endpoint',
  DATABASE_SECRET_NAME_OUTPUT: stackName + '-db-secret-name',
};
