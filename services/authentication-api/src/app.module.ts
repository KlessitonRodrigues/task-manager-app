import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { SwaggerController } from './modules/docs/swagger.controller';
import { SwaggerService } from './modules/docs/swagger.service';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController, SwaggerController],
  providers: [DatabaseModule, AuthService, SwaggerService],
})
export class AppModule {}
