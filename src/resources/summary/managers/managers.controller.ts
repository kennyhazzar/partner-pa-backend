import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagerDto } from '../dto/manager.dto';
import { AuthGuard } from '../../auth/guards';
import { isUUID } from 'class-validator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('managers')
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @ApiOperation({
    summary: 'Создание нового менеджера',
    description:
      'Используются такие же поля, как и для пользователя, только еще можно сразу назначить партнера при наличии его идентификатора',
  })
  @ApiBody({
    type: ManagerDto,
  })
  @Post()
  @UseGuards(AuthGuard)
  async createManager(@Body() payload: ManagerDto) {
    return this.managersService.create(payload);
  }

  @Get()
  @UseGuards(AuthGuard)
  async find(take: number, skip: number) {
    return this.managersService.find(take, skip);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    if (isUUID(id)) {
      return this.managersService.findOne(id);
    }
  }
}
