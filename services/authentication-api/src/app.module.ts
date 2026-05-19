import { Module } from '@nestjs/common';
import { SwaggerService } from './modules/docs/swagger.service';
import { SwaggerController } from './modules/docs/swagger.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ SwaggerController],
  providers: [  SwaggerService],
})
export class AppModule {}
