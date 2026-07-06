import { apiMessage } from '@packages/common-resources';
import { z } from 'zod';

import { APIGatewayHandler, createResponse } from '../../../utils/aws';
import { ErrorDto, SuccessDto } from '../common/api.dto';
import { CreateTaskDto, GetTaskResponseDto, UpdateTaskDto } from './task.dto';
import { TaskModel } from './task.model';

const TASK_SK = 'task';
const pkSchema = z.string().uuid();
const taskModel = new TaskModel();

const badRequest = (details: unknown) =>
  createResponse(400, ErrorDto.create({ ...apiMessage.INVALID_REQUEST, details }));

const internalError = (err: any) =>
  createResponse(
    500,
    ErrorDto.create({ details: err.message, ...apiMessage.INTERNAL_SERVER_ERROR }),
  );

export const findAllTaskService: APIGatewayHandler = async () => {
  try {
    const tasks = await taskModel.model.scan().exec();
    const parsed = z.array(GetTaskResponseDto.schema).safeParse(tasks);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const findOneTaskService: APIGatewayHandler = async event => {
  try {
    const pkResult = pkSchema.safeParse(event.pathParameters?.id);
    if (!pkResult.success) return badRequest(pkResult.error.flatten());

    const task = await taskModel.model.get({ pk: pkResult.data, sk: TASK_SK });
    if (!task) return createResponse(404, ErrorDto.create({ ...apiMessage.NOT_FOUND }));

    const parsed = GetTaskResponseDto.schema.safeParse(task);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const createTaskService: APIGatewayHandler = async event => {
  try {
    const body = JSON.parse(event.body || '{}');
    const dtoResult = CreateTaskDto.schema.safeParse(body);
    if (!dtoResult.success) return badRequest(dtoResult.error.flatten());

    const task = await taskModel.model.create({ sk: TASK_SK, ...dtoResult.data });

    const parsed = GetTaskResponseDto.schema.safeParse(task);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const updateTaskService: APIGatewayHandler = async event => {
  try {
    const pkResult = pkSchema.safeParse(event.pathParameters?.id);
    if (!pkResult.success) return badRequest(pkResult.error.flatten());

    const body = JSON.parse(event.body || '{}');
    const dtoResult = UpdateTaskDto.schema.safeParse(body);
    if (!dtoResult.success) return badRequest(dtoResult.error.flatten());

    const task = await taskModel.model.get({ pk: pkResult.data, sk: TASK_SK });
    if (!task) return createResponse(404, ErrorDto.create({ ...apiMessage.NOT_FOUND }));

    await taskModel.model.update({ pk: pkResult.data, sk: TASK_SK }, dtoResult.data);
    const updated = await taskModel.model.get({ pk: pkResult.data, sk: TASK_SK });

    const parsed = GetTaskResponseDto.schema.safeParse(updated);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const deleteTaskService: APIGatewayHandler = async event => {
  try {
    const pkResult = pkSchema.safeParse(event.pathParameters?.id);
    if (!pkResult.success) return badRequest(pkResult.error.flatten());

    const task = await taskModel.model.get({ pk: pkResult.data, sk: TASK_SK });
    if (!task) return createResponse(404, ErrorDto.create({ ...apiMessage.NOT_FOUND }));

    await taskModel.model.delete({ pk: pkResult.data, sk: TASK_SK });
    return createResponse(200, SuccessDto.create({ ...apiMessage.DELETED_SUCCESSFULLY }));
  } catch (err: any) {
    return internalError(err);
  }
};
