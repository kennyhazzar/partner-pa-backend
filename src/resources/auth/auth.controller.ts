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
  LoginDto,
  LoginResponse,
  RefreshTokenDto,
  RegisterDto,
  SendCodeDto,
  VerifyCodeDto,
} from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Регистрация пользователя',
    description:
      'Для первой авторизации пользователю нужно подтвердить почту (auth/verify-code). Если код оказался неактуальным, следует отправить запрос (auth/send-code) для получения нового кода',
  })
  @ApiBody({
    description: 'Базовые поля для регистрации',
    type: RegisterDto,
    required: true,
  })
  @Post('register')
  async register(
    @Body() { email, password, firstName }: RegisterDto,
  ): Promise<void> {
    await this.authService.register(email, password, firstName);
  }

  @ApiOperation({
    summary: 'Авторизация пользователя',
    description:
      'Перед тем, как авторизоваться в первый раз, пользователю нужно подтвердить почту (auth/verify-code). Если код оказался неактуальным, следует отправить запрос (auth/send-code) для получения нового кода',
  })
  @ApiBody({
    description: 'Базовые поля для авторизации',
    type: LoginDto,
    required: true,
  })
  @Post('login')
  async login(@Body() { email, password }: LoginDto): Promise<LoginResponse> {
    return this.authService.login(email, password);
  }

  @ApiOperation({
    summary: 'Отправка кода для верификации почты',
    description:
      'Метод для повторного получения кода. При регистрации (auth/register) код отправляется автоматически',
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
  async verifyCode(@Body() { email, code }: VerifyCodeDto): Promise<void> {
    const isValid = await this.authService.validateVerificationCode(
      email,
      code,
    );
    if (!isValid) {
      throw new BadRequestException('Неверный код подтверждения');
    }
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
