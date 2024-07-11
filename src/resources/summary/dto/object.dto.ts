import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  CreateRequisitesDto,
  InnResponse,
  UpdateRequisitesDto,
} from './create-requisites.dto';
import { FindOptionsSelect } from 'typeorm';
import { LicensedObject } from '../entities';

export class ObjectsRelationsDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  managerId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  accountId?: string;
}

export class CreateObjectDto extends ObjectsRelationsDto {
  @ApiProperty({
    description: 'Название объекта',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 128)
  title: string;

  @ApiProperty({
    type: CreateRequisitesDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateRequisitesDto)
  @IsArray()
  @IsOptional()
  requisites: CreateRequisitesDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;
}

export class ObjectDetails {
  @ApiProperty({
    description: 'Название объекта',
    required: true,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  dateOfEstablishment?: Date;
}

export class UpdateObjectDto extends ObjectsRelationsDto {
  @ApiProperty()
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  @Type(() => ObjectDetails)
  details: ObjectDetails;

  @ApiProperty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  @Type(() => UpdateRequisitesDto)
  requisites: UpdateRequisitesDto[];
}

export class FindObjectsQuery extends ObjectsRelationsDto {}
export class FindOneObjectQuery extends ObjectsRelationsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export const fullFindOptionsObjectSelect: FindOptionsSelect<LicensedObject> = {
  id: true,
  account: {
    id: true,
  },
  title: true,
  phone: true,
  email: true,
  dateOfEstablishment: true,
  requisites: {
    id: true,
    requisites: {
      id: true,
      address: true,
      inn: true,
      kpp: true,
      companyName: true,
    },
  },
  manager: {
    id: true,
    firstName: true,
    secondName: true,
    lastName: true,
    fullName: true,
  },
  createdAt: true,
  updatedAt: true,
};

export class FindObjectRawQueryBuilderResponse {
  licensedObjectId: string;
  licensedObjectCreatedAt: Date;
  licensedObjectUpdatedAt: Date;
  licensedObjectEmail: string;
  licensedObjectPhone: string;
  licensedObjectTitle: string;
  partnerTitle: string;
  reqId: string;
  managerFirstName: string;
  managerSecondName: string;
  managerLastName: string;
  LT: number;
  averageCheck: string;
  LTV: string;
  isActive: boolean;
}

export class FindObjectsResponse {
  id: string;

  title: string;

  inn?: InnResponse;

  companyName?: string;

  email: string;

  phone: string;

  partnerTitle: string;

  status: boolean;

  isSubscribe: boolean;

  subscribeLastDate: Date;

  subscribeEndDate: Date;

  lt: number;

  ltv: number;

  averageBill: number;

  createdAt: Date;

  updatedAt: Date;
}
