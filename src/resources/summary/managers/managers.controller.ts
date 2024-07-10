import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagerDto } from '../dto/manager.dto';
import { AuthGuard } from '../../auth/guards';
import { isUUID } from 'class-validator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async createManager(@Body() payload: ManagerDto) {
    return this.managersService.create(payload);
  }

  @ApiOperation({
    summary: 'Получение списка менеджеров',
  })
  @ApiQuery({
    name: 'take',
    required: false,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
  })
  @Get()
  @UseGuards(AuthGuard)
  async find(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.managersService.find(take, skip);
  }

  @ApiOperation({
    summary: 'Получение конкретного менеджера',
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    if (isUUID(id)) {
      return this.managersService.findOne(id);
    }
  }
}
