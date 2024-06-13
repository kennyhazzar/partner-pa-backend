import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponse, VerifyCodeDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendVerificationCode(@Body('email') email: string): Promise<void> {
    await this.authService.sendVerificationCode(email);
  }

  @Post('verify-code')
  async verifyCode(
    @Body() { email, code }: VerifyCodeDto,
  ): Promise<LoginResponse> {
    const isValid = await this.authService.validateVerificationCode(
      email,
      code,
    );
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }
    return this.authService.login(email);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
  ): Promise<LoginResponse> {
    try {
      return await this.authService.refreshToken(refreshToken);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
