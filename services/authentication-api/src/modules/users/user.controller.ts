import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';

import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Post(':id')
  @UsePipes(ZodValidationPipe)
  async updateUser(@Param('id') id: number, @Body() user: CreateUserDto) {
    return this.userService.updateUser(id, user);
  }

  @Post(':id/patch')
  @UsePipes(ZodValidationPipe)
  async patchUser(@Param('id') id: number, @Body() user: CreateUserDto) {
    return this.userService.patchUser(id, user);
  }

  @Post(':id/delete')
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
