import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
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
  UpdateRequisitesDto,
} from './create-requisites.dto';

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

  @ApiProperty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateRequisitesDto)
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
