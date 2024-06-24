import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginResponse,
  RefreshTokenDto,
  SendCodeDto,
  VerifyCodeDto,
} from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Отправка кода для верификации почты',
  })
  @ApiBody({
    description: 'Тело запроса для отправки кода',
    type: SendCodeDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Код отправлен успешно',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Код возможно получить только раз в минуту',
  })
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendVerificationCode(@Body() { email }: SendCodeDto): Promise<void> {
    await this.authService.sendVerificationCode(email);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Метод для верификации кода',
  })
  @ApiBody({
    description: 'Почта и код для верификации',
    type: VerifyCodeDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Верификация пройдена успешно, возвращается пара токенов для доступа',
    type: LoginResponse,
  })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Обновление токенов',
    description: 'Обновление как accessToken, так и refreshToken',
  })
  @ApiBody({
    description: 'Тело с токеном refreshToken',
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Тело ответа с парой новых токенов accessToken и refreshToken',
    type: LoginResponse,
  })
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<LoginResponse> {
    try {
      return await this.authService.refreshToken(refreshToken);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
