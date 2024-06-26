import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  MinLength,
} from 'class-validator';
import { ProfileDto } from '../../user/dto';

export class SendCodeDto {
  @ApiProperty({
    example: 'noname@mail.co',
    description: 'Электронная почта пользователя',
    required: true,
  })
  @IsDefined()
  @IsEmail()
  email: string;
}

export class LoginDto extends SendCodeDto {
  @ApiProperty({
    example: 'somepass123',
    description: 'Пароль пользователя',
    required: true,
  })
  @IsDefined()
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'Браваргл',
    description: 'Имя пользователя',
    required: true,
  })
  firstName: string;
}

export class VerifyCodeDto extends SendCodeDto {
  @ApiProperty({
    example: 123456,
    description: 'Код для верификации почты',
    required: true,
  })
  @IsDefined()
  @IsString()
  @Length(6, 6)
  code: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'p4Li7X7PSf7A0ll0rM5SmrzmZdh0ucAEmMqVQXLfesI4Owvqwzl6YktU0lyZ5QklJ5Wys4PJACsGtOL7kBL3HjFz2YJIymNMVTZgXHReEN35Hsf5FT1dZSWL',
    description: 'Токен обновления токена доступа',
    required: true,
  })
  @IsDefined()
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
