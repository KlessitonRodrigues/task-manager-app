import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'dev-secret';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

interface User {
  userId: string;
  email: string;
  userName: string;
  password: string;
  recoveryCode?: string;
  recoveryCodeExpiry?: string;
}

@Injectable()
export class AuthService {


  async signIn(email: string, password: string) {

  }

  async signUp(email: string, password: string, userName: string) {

  }

  signOut() {}

  refresh(token: string) {}

  async sendRecoveryCode(email: string) {

  }

  verifyRecoveryCode(email: string, code: string) {

  }

  async resetPassword(token: string, newPassword: string) {  }

  async googleSignIn(accessToken: string) {
  }
}
