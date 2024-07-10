import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UpdateRequisitesDto } from './create-requisites.dto';

export class CreatePartnerDto {
  @ApiProperty({
    description: 'Название партнера',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 128)
  title: string;

  @ApiProperty({
    type: UpdateRequisitesDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  @Type(() => UpdateRequisitesDto)
  requisites: UpdateRequisitesDto[];
}
