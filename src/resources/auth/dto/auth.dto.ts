import { IsDefined, IsEmail, IsNumber, IsString } from 'class-validator';

export class SendCodeDto {
  @IsDefined()
  @IsEmail()
  email: string;
}

export class VerifyCodeDto extends SendCodeDto {
  @IsDefined()
  @IsNumber()
  code: number;
}

export class RefreshTokenDto {
  @IsDefined()
  @IsString()
  refreshToken: string;
}

export class LoginResponse {
  accessToken: string;
  refreshToken: string;
}
