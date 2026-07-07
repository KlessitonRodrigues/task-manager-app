import { Request, Response } from 'express';

import { APIGatewayHandler } from './lambda';

export const expressToLambdaEvent = (lambda: APIGatewayHandler) => {
  return async (req: Request, res: Response) => {
    const lambdaResponse = await lambda({
      resource: req.path,
      path: req.path,
      httpMethod: req.method,
      queryStringParameters: req.query,
      multiValueQueryStringParameters: req.query,
      pathParameters: req.params,
      headers: {
        Authorization: req.headers.authorization,
        ...req.headers,
      },
      stageVariables: {},
      body: JSON.stringify(req.body),
      isBase64Encoded: false,
    });

    lambdaResponse;
    res
      .status(lambdaResponse.statusCode)
      .set(lambdaResponse.headers || {})
      .send(lambdaResponse.body);
  };
};
