import { apiMessage } from '@packages/common-resources';
import axios from 'axios';
import { randomUUID } from 'node:crypto';

import dotenv from '../../constants/dotenv';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

describe('Task API', () => {
  const baseURL = dotenv.BASE_URL;
  if (!baseURL) throw new Error('missing BASE_URL');

  const apiClient = axios.create({ baseURL });
  const testId = randomUUID().replace(/-/g, '');

  const createTaskDto: CreateTaskDto = {
    name: `Test Task ${testId}`,
    description: 'A test task description',
    status: 'pending',
    priority: 'normal',
    dueDate: '2025-12-31',
    progressList: [],
  };

  const updateTaskDto: UpdateTaskDto = {
    name: `Updated Task ${testId}`,
    description: 'Updated description',
    status: 'in-progress',
    priority: 'high',
    progressList: ['step 1 done'],
  };

  let createdTaskId: string;

  it('should create a new task and return 201 status', async () => {
    const response = await apiClient.post('/task', createTaskDto);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      name: createTaskDto.name,
      status: createTaskDto.status,
      priority: createTaskDto.priority,
    });
    expect(response.data).toHaveProperty('pk');

    createdTaskId = response.data.pk;
  });

  it('should list tasks and include the created task', async () => {
    const response = await apiClient.get('/task');

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pk: createdTaskId,
          name: createTaskDto.name,
        }),
      ]),
    );
  });

  it('should return a task by id', async () => {
    const response = await apiClient.get(`/task/${createdTaskId}`);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      pk: createdTaskId,
      name: createTaskDto.name,
      status: createTaskDto.status,
    });
  });

  it('should update a task with put', async () => {
    const response = await apiClient.put(`/task/${createdTaskId}`, updateTaskDto);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      pk: createdTaskId,
      name: updateTaskDto.name,
      status: updateTaskDto.status,
      priority: updateTaskDto.priority,
    });
  });

  it('should delete a task and return a success message', async () => {
    const response = await apiClient.delete(`/task/${createdTaskId}`);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ...apiMessage.DELETED_SUCCESSFULLY });
  });

  it('should return 400 status for invalid task data', async () => {
    const invalidTaskDto = { name: '' };

    await expect(apiClient.post('/task', invalidTaskDto)).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it('should clean up any test data', async () => {
    if (!createdTaskId) return;
    await apiClient.delete(`/task/${createdTaskId}`).catch(() => undefined);
  });
});
