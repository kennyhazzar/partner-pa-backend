import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsString,
  Length,
  MinLength,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { UserRole } from '@core/types';

export class EmailDto {
  @ApiProperty({
    example: 'noname@mail.co',
    description: 'Электронная почта пользователя',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDto extends EmailDto {
  @ApiProperty({
    example: 'somepass123',
    description: 'Пароль пользователя',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Браваргл',
    description: 'Имя пользователя',
    required: true,
  })
  firstName: string;
}

export class VerifyCodeDto extends EmailDto {
  @ApiProperty({
    example: '000000',
    description: 'Код для верификации почты',
    required: true,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  code: string;
}

export class ResetPasswordDto extends EmailDto {
  @ApiProperty({
    description: 'Токен сброса пароля',
    example: 'token',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  token: string;
  @ApiProperty({
    description: 'Новый пароль пользователя',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'p4Li7X7PSf7A0ll0rM5SmrzmZdh0ucAEmMqVQXLfesI4Owvqwzl6YktU0lyZ5QklJ5Wys4PJACsGtOL7kBL3HjFz2YJIymNMVTZgXHReEN35Hsf5FT1dZSWL',
    description: 'Токен обновления токена доступа',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class LoginResponse {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRtaXRyaXZlbnRyb0BnbWFpbC5jb20iLCJpYXQiOjE3MTkwNjA2NTIsImV4cCI6MTcxOTA2NDI1Mn0.Xv1d21M7gdQkCnhXCZue3ABz2_P1VV3VOVUweNOoPo8',
    description: 'Токен доступа',
  })
  accessToken: string;
  @ApiProperty({
    example:
      'p4Li7X7PSf7A0ll0rM5SmrzmZdh0ucAEmMqVQXLfesI4Owvqwzl6YktU0lyZ5QklJ5Wys4PJACsGtOL7kBL3HjFz2YJIymNMVTZgXHReEN35Hsf5FT1dZSWL',
    description: 'Токен обновления токена доступа',
  })
  refreshToken: string;
}

export interface SendVerifyCode {
  lastSent: number;
  code: string;
}

export class SetRoleDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}