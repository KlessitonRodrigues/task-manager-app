import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const taskSchema = {
  id: z.string().uuid(),
  type: z.string().default('TASK'),
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
    type: taskSchema.type,
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
