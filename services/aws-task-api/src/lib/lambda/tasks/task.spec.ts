import '../../../config/dotenv'; // sort-imports-ignore

import axios from 'axios';
import { randomUUID } from 'crypto';

import dotenv from '../../../constants/environment';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { apiMessages } from '../../../constants/apiMessages';

describe('Tasks API', () => {
  const baseURL = dotenv.TEST_API_URL;
  if (!baseURL) throw new Error('missing TEST_API_URL');
  const apiClient = axios.create({ baseURL });

  const testId = randomUUID().replace(/-/g, '');
  const createTaskDto: CreateTaskDto = {
    name: `Test Task ${testId}`,
    description: `Description for task ${testId}`,
    status: 'pending',
    priority: 'normal',
    dueDate: '2026-12-31',
    progressList: [],
  };

  let createdTaskId: string;

  it('should create a new task and return 200 status', async () => {
    const response = await apiClient.post('/tasks', createTaskDto);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      name: createTaskDto.name,
      description: createTaskDto.description,
      status: createTaskDto.status,
      priority: createTaskDto.priority,
    });
    createdTaskId = response.data.id;
    expect(createdTaskId).toBeDefined();
  });

  it('should return 400 status for invalid task data', async () => {
    await expect(apiClient.post('/tasks', { name: '' })).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it('should list all tasks and return 200 status', async () => {
    const response = await apiClient.get('/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should get a task by id and return 200 status', async () => {
    const response = await apiClient.get(`/tasks/${createdTaskId}`);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      id: createdTaskId,
      name: createTaskDto.name,
    });
  });

  it('should return 400 status for invalid task id', async () => {
    await expect(apiClient.get('/tasks/not-a-valid-uuid')).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it('should return 404 status for non-existent task', async () => {
    await expect(apiClient.get(`/tasks/${randomUUID()}`)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it('should update a task and return 200 status', async () => {
    const updateDto: UpdateTaskDto = { name: `Updated Task 123 ${testId}`, status: 'in_progress' };
    const response = await apiClient.put(`/tasks/${createdTaskId}`, updateDto);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      id: createdTaskId,
      name: updateDto.name,
      status: updateDto.status,
    });
  });

  it('should return 404 when updating a non-existent task', async () => {
    await expect(
      apiClient.put(`/tasks/${randomUUID()}`, { name: 'Ghost Task' }),
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  it('should delete a task and return 200 status', async () => {
    const response = await apiClient.delete(`/tasks/${createdTaskId}`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ...apiMessages.DELETED_SUCCESSFULLY });
  });

  it('should return 404 when deleting a non-existent task', async () => {
    await expect(apiClient.delete(`/tasks/${randomUUID()}`)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it('should clean up any test data', async () => {
    if (!createdTaskId) return;
    await apiClient.delete(`/tasks/${createdTaskId}`).catch(() => undefined);
  });
});
