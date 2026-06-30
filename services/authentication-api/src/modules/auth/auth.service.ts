import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { apiErrors } from '@packages/common-resources';
import { Repository } from 'typeorm';

import { ErrorDto } from '../common/dto/errorResponse';
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
  signIn(data: SignInDto): Promise<SignInResponseDto | ErrorDto>;
  signUp(data: SignUpDto): Promise<SignUpResponseDto | ErrorDto>;
  signOut(): Promise<{ message: string } | ErrorDto>;
  refresh(data: RefreshTokenDto): Promise<RefreshTokenDto | ErrorDto>;
  sendRecoveryCode(data: SendRecoveryCodeDto): Promise<{ message: string } | ErrorDto>;
  verifyRecoveryCode(data: VerifyRecoveryCodeDto): Promise<{ message: string } | ErrorDto>;
  resetPassword(data: ResetPasswordDto): Promise<{ message: string } | ErrorDto>;
  googleSignIn(data: GoogleSignInDto): Promise<SignInResponseDto | ErrorDto>;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signIn(data: SignInDto): Promise<SignInResponseDto | ErrorDto> {
    try {
      const user = await this.userRepository.findOne({ where: { email: data.email } });
      if (!user) return ErrorDto.create({ ...apiErrors.USER_NOT_FOUND });

      return SignInResponseDto.create({
        accessToken: 'dummyAccessToken',
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiErrors.INTERNAL_SERVER_ERROR });
    }
  }

  async signUp(data: SignUpDto): Promise<SignUpResponseDto | ErrorDto> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
      if (existingUser) return ErrorDto.create({ ...apiErrors.INTERNAL_SERVER_ERROR });

      const newUser = this.userRepository.create({
        email: data.email,
        name: data.name,
        password: data.password,
      });
      const savedUser = await this.userRepository.save(newUser);

      return SignUpResponseDto.create({
        email: savedUser.email,
        name: savedUser.name,
      });
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiErrors.INTERNAL_SERVER_ERROR });
    }
  }

  async signOut(): Promise<{ message: string } | ErrorDto> {
    try {
      return { message: 'Signed out successfully' };
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiErrors.INTERNAL_SERVER_ERROR });
    }
  }

  async refresh(data: RefreshTokenDto): Promise<RefreshTokenDto | ErrorDto> {
    try {
      return RefreshTokenDto.create({ accessToken: 'newDummyAccessToken' });
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiErrors.INTERNAL_SERVER_ERROR });
    }
  }

  async sendRecoveryCode(data: SendRecoveryCodeDto): Promise<{ message: string } | ErrorDto> {
    try {
      const user = await this.userRepository.findOne({ where: { email: data.email } });
      if (!user) return ErrorDto.create({ ...apiErrors.USER_NOT_FOUND });

      return { message: 'Recovery code sent successfully' };
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiErrors.INTERNAL_SERVER_ERROR });
    }
  }

  async verifyRecoveryCode(data: VerifyRecoveryCodeDto): Promise<{ message: string } | ErrorDto> {
    try {
      const user = await this.userRepository.findOne({ where: { email: data.email } });
      if (!user) return ErrorDto.create({ ...apiErrors.USER_NOT_FOUND });

      return { message: 'Recovery code verified successfully' };
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiErrors.INTERNAL_SERVER_ERROR });
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string } | ErrorDto> {
    try {
      return { message: 'Password reset successfully' };
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiErrors.INTERNAL_SERVER_ERROR });
    }
  }

  async googleSignIn(data: GoogleSignInDto): Promise<SignInResponseDto | ErrorDto> {
    try {
      return SignInResponseDto.create({
        accessToken: data.accessToken,
        email: 'google@example.com',
        name: 'Google User',
      });
    } catch (error) {
      const details = error instanceof Error ? error.message : error;
      return ErrorDto.create({ details, ...apiErrors.INTERNAL_SERVER_ERROR });
    }
  }
}
