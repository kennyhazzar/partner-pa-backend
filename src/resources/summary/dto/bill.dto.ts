import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateBillDto {
  @IsOptional()
  @IsString()
  documentName?: string;

  @IsOptional()
  @IsString()
  documentPath?: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsNumber()
  invoiceAmount: number;

  @IsNotEmpty()
  @IsNumber()
  paymentAmount: number;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}

export class CreateBillWithRelationsDto {
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  @Type(() => CreateBillDto)
  bill: CreateBillDto;

  @IsOptional()
  @IsUUID()
  managerId: string;

  @IsOptional()
  @IsUUID()
  licensedObjectId: string;
}
