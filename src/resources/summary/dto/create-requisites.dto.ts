import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class UpdateEntityRequisitesDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  requisitesId?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  objectId?: string;

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
  accountId?: string;
}

export class CreateRequisitesDto extends UpdateEntityRequisitesDto {
  @ApiProperty({
    description: 'ИНН',
    minLength: 10,
    maxLength: 12,
  })
  @IsString()
  @Length(10, 12)
  @IsNotEmpty()
  inn: string;

  @ApiProperty({
    description: 'КПП',
    minLength: 9,
    maxLength: 9,
  })
  @IsString()
  @Length(9, 9)
  @IsNotEmpty()
  kpp: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateRequisitesDto extends CreateRequisitesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class FindRequisitesQuery {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class InnResponse {
  @ApiProperty({
    required: false,
    nullable: true,
  })
  inn: string;
  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    isArray: true,
  })
  ids: Array<string>;
  @ApiProperty()
  kpp: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  companyName?: string;
}
