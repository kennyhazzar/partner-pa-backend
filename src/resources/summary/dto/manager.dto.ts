import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from '@resources/user/dto';
import { IsOptional, IsUUID } from 'class-validator';

export class ManagerDto extends ProfileDto {
  @ApiProperty({
    description: 'При создании менеджера можно сразу назначить партнера',
  })
  @IsUUID()
  @IsOptional()
  partnerId: string;
}
