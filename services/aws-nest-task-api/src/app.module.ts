import { Module } from '@nestjs/common';

import { SwaggerModule } from './modules/docs/swegger.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [SwaggerModule, TaskModule],
  providers: [],
})
export class AppModule {}
