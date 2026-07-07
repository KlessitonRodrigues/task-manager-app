import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';

export const addPreflight = (resource: cdk.aws_apigateway.Resource) => {
  resource.addCorsPreflight({
    allowOrigins: ['http://localhost:3000'],
    allowMethods: gateway.Cors.ALL_METHODS,
    allowHeaders: [...gateway.Cors.DEFAULT_HEADERS, 'Cookie'],
    allowCredentials: true,
  });
};

export const addCorsPreflight = (resource: cdk.aws_apigateway.Resource) => {
  resource.addCorsPreflight({
    allowOrigins: gateway.Cors.ALL_ORIGINS,
    allowMethods: gateway.Cors.ALL_METHODS,
    allowHeaders: [...gateway.Cors.DEFAULT_HEADERS, 'lang'],
    allowCredentials: true,
  });
};
