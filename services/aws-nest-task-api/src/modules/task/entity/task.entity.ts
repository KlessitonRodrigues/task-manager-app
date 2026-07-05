import dotenv from '@/src/constants/dotenv';
import { Injectable } from '@nestjs/common';
import * as dynamoose from 'dynamoose';

const schema = new dynamoose.Schema({
  pk: { type: String, required: true, default: () => crypto.randomUUID() },
  sk: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, default: 'pending' },
  priority: { type: String, required: true, default: 'normal' },
  dueDate: { type: String },
  progressList: { type: Array, schema: [String], default: [] },
  createdAt: { type: String, required: true, default: () => new Date().toISOString() },
});

@Injectable()
export class TaskEntity {
  public readonly model = dynamoose.model('Tasks', schema, {
    tableName: dotenv.TASK_TABLE_NAME,
  });
}
