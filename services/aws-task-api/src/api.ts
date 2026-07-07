import './config/dotenv'; // sort-imports-ignore

import * as bodyparser from 'body-parser';
import { expressToLambdaEvent } from './utils/express';
import * as taskService from './lib/lambda/tasks/task.service';

const express = require('express');
const cors = require('cors');

const localRoutes = () => {
  const router = express.Router();
  router.get('/tasks', expressToLambdaEvent(taskService.findAllTaskService));
  router.get('/tasks/:id', expressToLambdaEvent(taskService.findOneTaskService));
  router.post('/tasks', expressToLambdaEvent(taskService.createTaskService));
  router.put('/tasks/:id', expressToLambdaEvent(taskService.updateTaskService));
  router.delete('/tasks/:id', expressToLambdaEvent(taskService.deleteTaskService));
  return router;
};

const localApi = async () => {
  const app = express();
  const routes = localRoutes();
  const port = 3005;

  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use(
    cors({
      credentials: true,
      origin: (_: any, callback: any) => callback(null, true),
    }),
  );
  app.use(routes);
  app.listen(port, () => console.log('Running at: http://localhost:' + port));
};

localApi();
