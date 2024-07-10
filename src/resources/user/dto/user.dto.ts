import { Request } from 'express';
import { User } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FindOptionsSelect } from 'typeorm';

export type UserRequestContext = Request & { user: User };

export class UpdateProfileDto {
  @ApiProperty({
    example: 'noname@mail.co',
    description: 'Электронная почта',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  email?: string;
  @ApiProperty({
    example: '+79876543210',
    description: 'Номер телефона',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  phone?: string;
  @ApiProperty({
    example: 7743013902,
    description: 'ИНН',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  itn?: number;
  @ApiProperty({
    example: 'Браваргл',
    description: 'Имя пользователя',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  firstName?: string;
  @ApiProperty({
    example: 'Браварглов',
    description: 'Фамилия пользователя',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  secondName?: string;
  @ApiProperty({
    example: 'Браварглович',
    description: 'Отчество пользователя',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  managerId?: string;
}

export class ProfileDto extends UpdateProfileDto {
  @ApiProperty()
  id: string;
  constructor() {
    super();
    delete this.managerId;
  }
}

export class UserFindOneWhere {
  @IsOptional()
  @IsUUID()
  id?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
}

export const fullFindOptionsUserSelect: FindOptionsSelect<User> = {
  id: true,
  createdAt: true,
  deletedAt: true,
  email: true,
  firstName: true,
  isDeleted: true,
  isEmailConfirmed: true,
  itn: true,
  lastName: true,
  managerAccount: {
    id: true,
  },
};
