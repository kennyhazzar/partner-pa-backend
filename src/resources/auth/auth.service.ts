import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { CommonConfigs, EmailConfigs } from '@core/types';
import { LoginResponse, SendVerifyCode } from './dto';
import { getRandomCode } from '@core/utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly mailConfig = this.getMailConfig();
  private readonly commonConfig = this.getCommonConfig();

  async register(
    email: string,
    password: string,
    firstName: string,
  ): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Почта уже используется');
    }

    const newUser = await this.usersService.create(email, password, firstName);

    await this.sendVerificationCode(newUser.email);
  }

  async sendVerificationCode(email: string): Promise<void> {
    const { host, pass, port, user: emailUser } = this.mailConfig;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const code = getRandomCode();

    const verifyCache = await this.cacheManager.get<SendVerifyCode>(
      `verify_code_${email}`,
    );

    if (verifyCache?.lastSent && Date.now() - verifyCache?.lastSent < 60000) {
      throw new BadRequestException(
        `Please wait a minute before requesting a new code.`,
      );
    }

    await this.cacheManager.set(
      `verify_code_${email}`,
      { code, lastSent: Date.now() },
      600,
    );

    if (this.commonConfig.env === 'production') {
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
  }

  async validateVerificationCode(
    email: string,
    code: string,
  ): Promise<boolean> {
    const cacheKey = `verify_code_${email}`;

    const codeCache = await this.cacheManager.get<SendVerifyCode>(cacheKey);
    if (code === codeCache?.code) {
      await this.cacheManager.del(cacheKey);
      await this.usersService.confirmEmail(email);
      return true;
    }

    return false;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверный пароль');
    }

    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException('Подтвердите почту'); //TODO: сделать автоотправку кода, если текущего нету в кеше
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

  private getMailConfig(): EmailConfigs {
    return this.configService.get<EmailConfigs>('email');
  }

  private getCommonConfig(): CommonConfigs {
    return this.configService.get<CommonConfigs>('common');
  }
}
