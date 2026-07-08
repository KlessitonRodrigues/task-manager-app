import { createZodDto } from '@packages/common-resources/utils/zod';
import { z } from 'zod';

export const taskSchema = {
  id: z.string().uuid(),
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
    id: taskSchema.id,
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
      name: taskSchema.name,
      description: taskSchema.description,
      status: taskSchema.status,
      priority: taskSchema.priority,
      dueDate: taskSchema.dueDate,
      progressList: taskSchema.progressList,
    })
    .partial(),
) {}
