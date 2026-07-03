import { Module } from '@nestjs/common';

import { TaskEntity } from './entity/task.entity';

@Module({
  imports: [],
  controllers: [],
  providers: [TaskEntity],
  exports: [TaskEntity],
})
export class TaskModule {}
