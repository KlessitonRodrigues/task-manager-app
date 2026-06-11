import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../users/entity/user.entity';
import {
  GoogleSignInDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SendRecoveryCodeDto,
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
  VerifyRecoveryCodeDto,
} from './dto/auth.dto';

interface AuthServiceInterface {
  signIn(data: SignInDto): Promise<SignInResponseDto | null>;
  signUp(data: SignUpDto): Promise<SignUpResponseDto | null>;
  signOut(): Promise<void>;
  refresh(data: RefreshTokenDto): Promise<RefreshTokenDto>;
  sendRecoveryCode(data: SendRecoveryCodeDto): Promise<void>;
  verifyRecoveryCode(data: VerifyRecoveryCodeDto): Promise<void>;
  resetPassword(data: ResetPasswordDto): Promise<void>;
  googleSignIn(data: GoogleSignInDto): Promise<void>;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signIn(data: SignInDto): Promise<SignInResponseDto | null> {
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) return null;

    return {
      accessToken: 'dummyAccessToken',
      email: user.email,
      name: user.name,
    };
  }

  async signUp(data: SignUpDto): Promise<SignUpResponseDto | null> {
    const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingUser) return null;

    const newUser = this.userRepository.create({
      email: data.email,
      password: data.password,
    });
    await this.userRepository.save(newUser);

    return {
      email: newUser.email,
      name: newUser.name,
    };
  }

  async signOut() {}

  async refresh(data: RefreshTokenDto): Promise<RefreshTokenDto> {
    return { accessToken: 'newDummyAccessToken' };
  }

  async sendRecoveryCode(data: SendRecoveryCodeDto): Promise<void> {}

  async verifyRecoveryCode(data: VerifyRecoveryCodeDto): Promise<void> {}

  async resetPassword(data: ResetPasswordDto): Promise<void> {}

  async googleSignIn(data: GoogleSignInDto): Promise<void> {}
}
