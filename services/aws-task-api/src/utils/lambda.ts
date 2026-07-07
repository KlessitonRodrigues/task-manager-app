import { apiMessage } from '@packages/common-resources';

import { ErrorDto } from '../lib/lambda/common/api.dto';

export type APIGatewayHandler = (event: any) => Promise<any>;

export type environment = { [key: string]: string };

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

export type CreateResponseOptions = (
  code: number,
  data: any,
  headers?: Record<string, string>,
) => APIGatewayResponse;

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
  console.error(err);
  return createResponse(
    500,
    ErrorDto.create({ details: err.message, ...apiMessage.INTERNAL_SERVER_ERROR }),
  );
};
