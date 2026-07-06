import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';

import { apiMessage } from '../../../../packages/common-resources/dist/constants/apiMessage';
import { ErrorDto } from '../lib/lambda/common/api.dto';

export type LambdasProps = Record<string, string>;

export type APIGatewayHandler = (event: any) => Promise<any>;

export type CreateResponseOptions = (
  code: number,
  data: any,
  headers?: Record<string, string>,
) => APIGatewayResponse;

export type CreateResponseWithCookiesOptions = (
  origin: string,
  code: number,
  data: any,
  headers?: Record<string, string>,
) => APIGatewayResponse;

export type APIGatewayResponse = {
  statusCode: number;
  body: string;
  headers: Record<string, string | number | boolean>;
};

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

export const createResponse: CreateResponseOptions = (code, data, headers) => {
  return {
    statusCode: code,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,lang',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,PATCH,DELETE',
      ...headers,
    },
  };
};

export const createResponseWithOrigin: CreateResponseWithCookiesOptions = (
  origin,
  code,
  data,
  headers,
) => {
  return {
    statusCode: code,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,lang',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,PATCH,DELETE',
      ...headers,
    },
  };
};

export const badRequest = (details: unknown) => {
  return createResponse(400, ErrorDto.create({ ...apiMessage.INVALID_REQUEST, details }));
};

export const internalError = (err: any) => {
  console.log(err);
  return createResponse(
    500,
    ErrorDto.create({ details: err.message, ...apiMessage.INTERNAL_SERVER_ERROR }),
  );
};
