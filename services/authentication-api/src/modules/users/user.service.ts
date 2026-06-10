import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';

interface IUserService {
  findAll(): Promise<UserEntity[]>;
  findOne(id: number): Promise<UserEntity | null>;
  createUser(user: CreateUserDto): Promise<UserEntity>;
  updateUser(id: number, user: CreateUserDto): Promise<UserEntity | null>;
  patchUser(id: number, user: CreateUserDto): Promise<UserEntity | null>;
  deleteUser(id: number): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, user: CreateUserDto): Promise<UserEntity | null> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async patchUser(id: number, user: CreateUserDto): Promise<UserEntity | null> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
