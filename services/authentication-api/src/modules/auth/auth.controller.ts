import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('signin')
  @HttpCode(200)
  signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('signup')
  @HttpCode(201)
  signUp(@Body() body: { email: string; password: string; userName: string }) {
    return this.authService.signUp(body.email, body.password, body.userName);
  }

  @Post('signout')
  @HttpCode(200)
  signOut() {
    return this.authService.signOut();
  }

  @Post('refresh-token')
  @HttpCode(200)
  refresh(@Body() body: { token: string }) {
    return this.authService.refresh(body.token);
  }

  @Post('send-recovery-code')
  @HttpCode(200)
  sendRecoveryCode(@Body() body: { email: string }) {
    return this.authService.sendRecoveryCode(body.email);
  }

  @Post('verify-recovery-code')
  @HttpCode(200)
  verifyRecoveryCode(@Body() body: { email: string; code: string }) {
    return this.authService.verifyRecoveryCode(body.email, body.code);
  }

  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('google')
  @HttpCode(200)
  googleSignIn(@Body() body: { token: string }) {
    return this.authService.googleSignIn(body.token);
  }
}
