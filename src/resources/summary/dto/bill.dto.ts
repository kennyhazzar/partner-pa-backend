import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsOptional()
  @IsString()
  documentName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  documentPath?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  invoiceAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paymentAmount: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}

export class CreateBillWithRelationsDto {
  @ApiProperty({
    type: CreateBillDto,
  })
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  @Type(() => CreateBillDto)
  bill: CreateBillDto;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  managerId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  licensedObjectId: string;
}
