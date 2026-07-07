import { apiMessage } from '@packages/common-resources';
import { z } from 'zod';

import {
  APIGatewayHandler,
  badRequest,
  createResponse,
  internalError,
} from '../../../utils/lambda';
import { ErrorDto, SuccessDto } from '../common/api.dto';
import { CreateTaskDto, GetTaskResponseDto, UpdateTaskDto, taskSchema } from './task.dto';
import { TaskModel } from './task.model';

const taskModel = new TaskModel();

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
    const pkResult = taskSchema.id.safeParse(event.pathParameters?.id);
    if (!pkResult.success) return badRequest(pkResult.error.flatten());

    const task = await taskModel.model.get({ id: pkResult.data });
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

    const task = await taskModel.model.create({ type: 'TASK', ...dtoResult.data });

    const parsed = GetTaskResponseDto.schema.safeParse(task);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const updateTaskService: APIGatewayHandler = async event => {
  try {
    const pkResult = taskSchema.id.safeParse(event.pathParameters?.id);
    if (!pkResult.success) return badRequest(pkResult.error.flatten());

    const body = JSON.parse(event.body || '{}');
    const dtoResult = UpdateTaskDto.schema.safeParse(body);
    if (!dtoResult.success) return badRequest(dtoResult.error.flatten());

    const task = await taskModel.model.get({ id: pkResult.data });
    if (!task) return createResponse(404, ErrorDto.create({ ...apiMessage.NOT_FOUND }));

    const updateData = Object.fromEntries(
      Object.entries(dtoResult.data).filter(([, v]) => v !== undefined),
    );
    await taskModel.model.update({ id: pkResult.data }, updateData);
    const updated = await taskModel.model.get({ id: pkResult.data });

    const parsed = GetTaskResponseDto.schema.safeParse(updated);
    if (!parsed.success) return badRequest(parsed.error.flatten());
    return createResponse(200, parsed.data);
  } catch (err: any) {
    return internalError(err);
  }
};

export const deleteTaskService: APIGatewayHandler = async event => {
  try {
    const pkResult = taskSchema.id.safeParse(event.pathParameters?.id);
    if (!pkResult.success) return badRequest(pkResult.error.flatten());

    const task = await taskModel.model.get({ id: pkResult.data });
    if (!task) return createResponse(404, ErrorDto.create({ ...apiMessage.NOT_FOUND }));

    await taskModel.model.delete({ id: pkResult.data });
    return createResponse(200, SuccessDto.create({ ...apiMessage.DELETED_SUCCESSFULLY }));
  } catch (err: any) {
    return internalError(err);
  }
};
