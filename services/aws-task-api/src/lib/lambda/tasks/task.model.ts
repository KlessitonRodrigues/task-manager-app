import * as crypto from 'crypto';
import * as dynamoose from 'dynamoose';

import dotenv from '../../../constants/enviroment';

const schema = new dynamoose.Schema({
  id: { type: String, required: true, default: () => crypto.randomUUID() },
  type: { type: String, required: true, default: 'TASK' },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, default: 'pending' },
  priority: { type: String, required: true, default: 'normal' },
  dueDate: { type: String },
  progressList: { type: Array, schema: [String], default: [] },
  createdAt: { type: String, required: true, default: () => new Date().toISOString() },
});

export class TaskModel {
  public readonly model = dynamoose.model('Tasks', schema, {
    tableName: dotenv.TASK_TABLE_NAME,
  });
}
