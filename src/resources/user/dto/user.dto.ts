import { Request } from 'express';
import { User } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export type UserRequestContext = Request & { user: User };

export class ProfileDto {
  @ApiProperty({
    example: 'noname@mail.co',
    description: 'Электронная почта',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  email: string;
  @ApiProperty({
    example: '+79876543210',
    description: 'Номер телефона',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  phone: string;
  @ApiProperty({
    example: 7743013902,
    description: 'ИНН',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  itn: number;
  @ApiProperty({
    example: 'Браваргл',
    description: 'Имя пользователя',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  firstName: string;
  @ApiProperty({
    example: 'Браварглов',
    description: 'Фамилия пользователя',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  secondName: string;
  @ApiProperty({
    example: 'Браварглович',
    description: 'Отчество пользователя',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  lastName: string;
}