import { IsEmail, IsNumber } from 'class-validator';

export class SendCodeDto {
  @IsEmail()
  email: string;
}

export class VerifyCodeDto extends SendCodeDto {
  @IsNumber()
  code: number;
}

export class LoginResponse {
  accessToken: string;
  refreshToken: string;
}
