import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorDto } from '../common/dto/errorResponse';
import { CreateUserDto, GetUserResponseDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';

interface IUserService {
  findAll(): Promise<GetUserResponseDto[]>;
  findOne(id: number): Promise<GetUserResponseDto | ErrorDto>;
  createUser(user: CreateUserDto): Promise<GetUserResponseDto>;
  updateUser(id: number, user: CreateUserDto): Promise<GetUserResponseDto | ErrorDto>;
  patchUser(id: number, user: CreateUserDto): Promise<GetUserResponseDto | ErrorDto>;
  deleteUser(id: number): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<GetUserResponseDto[]> {
    const dbUsers = await this.userRepository.find();
    return dbUsers.map(user => GetUserResponseDto.create(user));
  }

  async findOne(id: number): Promise<GetUserResponseDto | ErrorDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return ErrorDto.create({ message: 'User not found' });
    return GetUserResponseDto.create(user);
  }

  async createUser(user: CreateUserDto): Promise<GetUserResponseDto> {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    return GetUserResponseDto.create(savedUser);
  }

  async updateUser(id: number, user: CreateUserDto): Promise<GetUserResponseDto | ErrorDto> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async patchUser(id: number, user: CreateUserDto): Promise<GetUserResponseDto | ErrorDto> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
