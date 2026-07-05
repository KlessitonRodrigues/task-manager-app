import { Injectable } from '@nestjs/common';
import { apiMessage } from '@packages/common-resources';

import { ErrorDto, SuccessDto } from '../common/dto/apiResponse';
import { CreateTaskDto, GetTaskResponseDto, UpdateTaskDto } from './dto/task.dto';
import { TaskEntity } from './entity/task.entity';

const TASK_SK = 'task';
const taskNotFound = { code: 'ERR008', message: 'Task not found' };

interface ITaskService {
  findAll(): Promise<GetTaskResponseDto[] | ErrorDto>;
  findOne(pk: string): Promise<GetTaskResponseDto | ErrorDto>;
  createTask(dto: CreateTaskDto): Promise<GetTaskResponseDto | ErrorDto>;
  updateTask(pk: string, dto: UpdateTaskDto): Promise<GetTaskResponseDto | ErrorDto>;
  deleteTask(pk: string): Promise<SuccessDto | ErrorDto>;
}

@Injectable()
export class TaskService implements ITaskService {
  constructor(private readonly taskEntity: TaskEntity) {}

  async findAll(): Promise<GetTaskResponseDto[] | ErrorDto> {
    try {
      const tasks = await this.taskEntity.model.scan().exec();
      return tasks.map(task => GetTaskResponseDto.create(task));
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiMessage.INTERNAL_SERVER_ERROR });
    }
  }

  async findOne(pk: string): Promise<GetTaskResponseDto | ErrorDto> {
    try {
      const task = await this.taskEntity.model.get({ pk, sk: TASK_SK });
      if (!task) return ErrorDto.create({ ...taskNotFound });
      return GetTaskResponseDto.create(task);
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiMessage.INTERNAL_SERVER_ERROR });
    }
  }

  async createTask(dto: CreateTaskDto): Promise<GetTaskResponseDto | ErrorDto> {
    try {
      const task = await this.taskEntity.model.create({ sk: TASK_SK, ...dto });
      return GetTaskResponseDto.create(task);
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiMessage.INTERNAL_SERVER_ERROR });
    }
  }

  async updateTask(pk: string, dto: UpdateTaskDto): Promise<GetTaskResponseDto | ErrorDto> {
    try {
      const task = await this.taskEntity.model.get({ pk, sk: TASK_SK });
      if (!task) return ErrorDto.create({ ...taskNotFound });
      await this.taskEntity.model.update({ pk, sk: TASK_SK }, dto);
      return this.findOne(pk);
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiMessage.INTERNAL_SERVER_ERROR });
    }
  }

  async deleteTask(pk: string): Promise<SuccessDto | ErrorDto> {
    try {
      const task = await this.taskEntity.model.get({ pk, sk: TASK_SK });
      if (!task) return ErrorDto.create({ ...taskNotFound });
      await this.taskEntity.model.delete({ pk, sk: TASK_SK });
      return SuccessDto.create({ ...apiMessage.DELETED_SUCCESSFULLY });
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiMessage.INTERNAL_SERVER_ERROR });
    }
  }
}
