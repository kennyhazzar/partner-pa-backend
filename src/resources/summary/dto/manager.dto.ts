import { ApiProperty } from '@nestjs/swagger';
import { UpdateProfileDto } from '@resources/user/dto';
import { IsOptional, IsUUID } from 'class-validator';

export class ManagerDto extends UpdateProfileDto {
  @ApiProperty({
    description: 'При создании менеджера можно сразу назначить партнера',
  })
  @IsUUID()
  @IsOptional()
  partnerId: string;
}
