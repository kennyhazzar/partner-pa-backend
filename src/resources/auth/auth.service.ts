import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EmailConfigs } from '@core/types';
import { LoginResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendVerificationCode(email: string): Promise<void> {
    const {
      host,
      port,
      pass,
      user: emailUser,
    } = this.configService.get<EmailConfigs>('email');

    const user = await this.usersService.findOne(email);

    if (!user) {
      await this.usersService.create(email);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.cacheManager.set(`verify_code_${email}`, code, 600);

    const transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user: emailUser,
        pass,
      },
    });

    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: 'Your verification code',
      text: `Your verification code is: ${code}`,
    });
  }

  async validateVerificationCode(
    email: string,
    code: number,
  ): Promise<boolean> {
    const cacheKey = `verify_code_${email}`;

    const cachedCode = await this.cacheManager.get<string>(cacheKey);
    if (code === +cachedCode) {
      await this.cacheManager.del(cacheKey);
      return true;
    }

    return false;
  }

  async login(email: string): Promise<LoginResponse> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.usersService.createRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async refreshToken(oldToken: string): Promise<LoginResponse> {
    const refreshToken = await this.usersService.getRefreshToken(oldToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const payload = { email: refreshToken.user.email };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.usersService.createRefreshToken(
      refreshToken.user,
    );

    await this.usersService.deleteRefreshToken(oldToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    };
  }
}
