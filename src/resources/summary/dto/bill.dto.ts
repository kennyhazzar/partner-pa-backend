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
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  documentName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  documentPath?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  invoiceAmount: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paymentAmount: number;

  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @Type(() => CreateBillDto)
  bill: CreateBillDto;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  managerId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  licensedObjectId: string;
}
