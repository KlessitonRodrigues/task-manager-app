import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get()
  findAll() {
    return [
      { id: 1, username: 'john' },
      { id: 2, username: 'maria' },
    ];
  }
}
