import { Module } from '@nestjs/common';

import { TaskEntity } from './entity/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService, TaskEntity],
})
export class TaskModule {}
