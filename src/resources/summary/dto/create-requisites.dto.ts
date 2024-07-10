import {
  IsString,
  Length,
  IsNotEmpty,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class UpdateEntityRequisitesDto {
  @IsOptional()
  @IsUUID()
  requisitesId?: string;

  @IsOptional()
  @IsUUID()
  objectId?: string;

  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @IsOptional()
  @IsUUID()
  accountId?: string;
}

export class CreateRequisitesDto extends UpdateEntityRequisitesDto {
  @IsString()
  @Length(10, 12)
  @IsNotEmpty()
  inn: string;

  @IsString()
  @Length(9, 9)
  @IsNotEmpty()
  kpp: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class UpdateRequisitesDto extends CreateRequisitesDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class FindRequisitesQuery {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
