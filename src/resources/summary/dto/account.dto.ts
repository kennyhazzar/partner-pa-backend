import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ValidateNested,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { CreateRequisitesDto } from './create-requisites.dto';
import { Manager } from '../entities';
import { DeepPartial } from 'typeorm';

export class AccountRelationsDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  managerId?: string;
}

export class CreateAccountDto extends AccountRelationsDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateRequisitesDto)
  @IsArray()
  @IsOptional()
  requisites: CreateRequisitesDto[];

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('RU')
  phone?: string;
}

export class FindAccountsQuery extends AccountRelationsDto {}
export class FindAccountQuery extends AccountRelationsDto {
  @IsNotEmpty()
  @IsUUID()
  id?: string;
}

export class FindAccountsResponse {
  inn?: {
    inn: string;
    ids: Array<number>;
  };

  companyName?: string;

  email?: string;

  phone?: string;

  partner?: string;

  manager?: DeepPartial<Manager>;

  objectsRatio?: string;

  ltv: number;

  averageBill: number;

  revenue: number;
}

export class FindAccountsRawQueryBuilderResponse {
  accountId: string;
  accountEmail: string;
  accountPhone: string;
  partnerTitle: string;
  accountCreatedAt: Date;
  accountUpdatedAt: Date;
  managerFirstName: string;
  managerSecondName: string;
  managerLastName: string;
  totalLicensedObjects: string;
  activeLicensedObjects: string;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('RU')
  phone: string;
}
