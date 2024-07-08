import { IsString, Length, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRequisitesDto {
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
