import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginResponse,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
  EmailDto,
  VerifyCodeDto,
  SetRoleDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard, RolesGuard, ThrottlerBehindProxyGuard } from './guards';
import { Roles } from './roles.decorator';
import { UserRole } from '@core/types';
import { UserService } from '../user/user.service';

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

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
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerBehindProxyGuard)
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerBehindProxyGuard)
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
    type: EmailDto,
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
  @UseGuards(ThrottlerBehindProxyGuard)
  async sendVerificationCode(@Body() { email }: EmailDto): Promise<void> {
    await this.authService.sendVerificationCode(email);
  }

  @ApiOperation({
    summary: 'Метод для верификации кода',
  })
  @ApiBody({
    description:
      'Почта и код для верификации. При NODE_ENV нужно отправить код равный "000000"',
    type: VerifyCodeDto,
  })
  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerBehindProxyGuard)
  async verifyCode(@Body() { email, code }: VerifyCodeDto): Promise<void> {
    const isValid = await this.authService.validateVerificationCode(
      email,
      code,
    );
    if (!isValid) {
      throw new BadRequestException('Неверный код подтверждения');
    }
  }

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
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerBehindProxyGuard)
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<LoginResponse> {
    try {
      return await this.authService.refreshToken(refreshToken);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  @ApiOperation({
    summary: 'Метод для сброса пароля',
    description:
      'На почту должен прийти токен, в метод (auth/reset-password) следует передать новый пароль и токен сброса пароля',
  })
  @ApiBody({
    description: 'Для сброса нужна только электронная почта пользователя',
    type: EmailDto,
    required: true,
  })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerBehindProxyGuard)
  async forgotPassword(@Body() { email }: EmailDto): Promise<void> {
    await this.authService.sendPasswordResetToken(email);
  }

  @ApiOperation({
    summary: 'Метод для выполнения сброса пароля',
    description: 'Устанавливает новый пароль если токен сброса валиден',
  })
  @ApiBody({
    description:
      'Для выполнения сброса пароля требуется передать новый пароль, токен, полученный на почту, а также почту пользователя. При NODE_ENV нужно отправить токен равный "token"',
    type: ResetPasswordDto,
  })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerBehindProxyGuard)
  async resetPassword(
    @Body() { email, token, newPassword }: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(email, token, newPassword);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Метод для установки соответствующей роли',
    description: 'Может воспользоваться только рут',
  })
  @Post('set-role')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  async setRole(@Body() payload: SetRoleDto) {
    return this.usersService.setRole(payload);
  }
}
