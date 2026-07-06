import * as dynamoose from 'dynamoose';

import { resourceNames } from '../../../constants/resources';

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

export class TaskModel {
  public readonly model = dynamoose.model('Tasks', schema, {
    tableName: resourceNames.taskTable,
  });
}
