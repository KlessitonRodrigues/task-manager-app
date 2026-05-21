import { Injectable } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

interface AuthServiceInterface {
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, userName: string): Promise<void>;
  signOut(): Promise<void>;
  refresh(token: string): Promise<void>;
  sendRecoveryCode(email: string): Promise<void>;
  verifyRecoveryCode(email: string, code: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  googleSignIn(accessToken: string): Promise<void>;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(private readonly dbService: DatabaseModule) {}

  async signIn(email, password) {}

  async signUp(email, password, userName) {}

  async signOut() {}

  async refresh(token) {}

  async sendRecoveryCode(email) {}

  async verifyRecoveryCode(email, code) {}

  async resetPassword(token, newPassword) {}

  async googleSignIn(accessToken) {}
}
