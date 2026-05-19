import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

import { resourceNames, stackName } from '../../constants/resources';

export class PostgresRdsStack extends cdk.Stack {
  constructor(scope: Construct, props?: cdk.StackProps) {
    super(scope, stackName, props);

    const myIp = '45.7.76.15/32';

    const vpc = new ec2.Vpc(this, resourceNames.VPC_NAME, {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, resourceNames.SECURITY_GROUP, {
      vpc,
      allowAllOutbound: true,
    });

    dbSecurityGroup.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(5432));

    const db = new rds.DatabaseInstance(this, resourceNames.DATABASE_ID, {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_18_3,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroups: [dbSecurityGroup],
      publiclyAccessible: true,
      multiAz: false,
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      databaseName: 'appdb',
      allocatedStorage: 20,
      maxAllocatedStorage: 20,
      port: 5432,
      backupRetention: cdk.Duration.days(0),
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      storageType: rds.StorageType.GP2,
    });

    new cdk.CfnOutput(this, resourceNames.DATABASE_ENDPOINT_OUTPUT, {
      value: db.instanceEndpoint.hostname,
    });

    new cdk.CfnOutput(this, 'DbPort', {
      value: db.instanceEndpoint.port.toString(),
    });

    new cdk.CfnOutput(this, 'DbName', {
      value: 'appdb',
    });

    new cdk.CfnOutput(this, resourceNames.DATABASE_SECRET_NAME_OUTPUT, {
      value: db.secret?.secretName ?? 'no-secret',
    });
  }
}
