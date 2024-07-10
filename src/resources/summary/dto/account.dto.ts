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
  IsString,
} from 'class-validator';
import { CreateRequisitesDto, InnResponse } from './create-requisites.dto';
import { Manager } from '../entities';
import { DeepPartial } from 'typeorm';

export class AccountRelationsDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  managerId?: string;
}

export class CreateAccountDto extends AccountRelationsDto {
  @ApiProperty({
    description: 'Массив реквизитов',
    type: CreateRequisitesDto,
  })
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

  @ApiProperty()
  @IsOptional()
  @IsString()
  franchise?: string;
}

export class FindAccountsQuery extends AccountRelationsDto {}
export class FindAccountQuery extends AccountRelationsDto {
  @IsNotEmpty()
  @IsUUID()
  id?: string;
}

export class FindAccountsResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  inn?: InnResponse;
  @ApiProperty()
  companyName?: string;
  @ApiProperty()
  email?: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  partner?: string;
  @ApiProperty({
    type: Manager,
  })
  manager?: DeepPartial<Manager>;
  @ApiProperty()
  objectsRatio?: string;
  @ApiProperty()
  lt: number;
  @ApiProperty()
  ltv: number;
  @ApiProperty()
  averageBill: number;
}

export class FindAccountsRawQueryBuilderResponse {
  @ApiProperty()
  accountId: string;
  @ApiProperty()
  accountEmail: string;
  @ApiProperty()
  accountPhone: string;
  @ApiProperty()
  partnerTitle: string;
  @ApiProperty()
  accountCreatedAt: Date;
  @ApiProperty()
  accountUpdatedAt: Date;
  @ApiProperty()
  managerFirstName: string;
  @ApiProperty()
  managerSecondName: string;
  @ApiProperty()
  managerLastName: string;
  @ApiProperty()
  totalLicensedObjects: string;
  @ApiProperty()
  activeLicensedObjects: string;
  @ApiProperty()
  LT: number;
  @ApiProperty()
  averageCheck: string;
  @ApiProperty()
  LTV: string;
}

export class UpdateAccountDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('RU')
  phone: string;
}

export class UpdateSoftwareAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  softwareId: string;
}
