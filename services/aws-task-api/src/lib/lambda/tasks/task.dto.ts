import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const taskSchema = {
  pk: z.string().uuid(),
  sk: z.string().default('TASK'),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.string().default('pending'),
  priority: z.string().default('normal'),
  dueDate: z.string().optional(),
  progressList: z.array(z.string()).default([]),
  createdAt: z.string(),
};

export class GetTaskResponseDto extends createZodDto(
  z.object({
    pk: taskSchema.pk,
    sk: taskSchema.sk,
    name: taskSchema.name,
    description: taskSchema.description,
    status: taskSchema.status,
    priority: taskSchema.priority,
    dueDate: taskSchema.dueDate,
    progressList: taskSchema.progressList,
    createdAt: taskSchema.createdAt,
  }),
) {}

export class CreateTaskDto extends createZodDto(
  z.object({
    name: taskSchema.name,
    description: taskSchema.description,
    status: taskSchema.status,
    priority: taskSchema.priority,
    dueDate: taskSchema.dueDate,
    progressList: taskSchema.progressList,
  }),
) {}

export class UpdateTaskDto extends createZodDto(
  z
    .object({
      name: z.string().min(1).max(200),
      description: z.string(),
      status: z.string(),
      priority: z.string(),
      dueDate: z.string(),
      progressList: z.array(z.string()),
    })
    .partial(),
) {}
