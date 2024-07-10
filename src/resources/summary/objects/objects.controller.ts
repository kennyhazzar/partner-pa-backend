import {
  BadRequestException,
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
import { ObjectsService } from './objects.service';
import { CreateObjectDto, FindObjectsQuery } from '../dto/object.dto';
import { AuthGuard } from '@resources/auth/guards';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';

@ApiTags('objects')
@ApiBearerAuth()
@Controller('objects')
@UseGuards(AuthGuard)
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @ApiOperation({
    summary: 'Создание объекта'
  })
  @ApiBody({
    type: CreateObjectDto,
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() payload: CreateObjectDto) {
    return this.objectsService.create(payload);
  }

  @ApiOperation({
    summary: 'Получение списка объектов'
  })
  @Get()
  async find(
    @Query() query: FindObjectsQuery,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.objectsService.find(query, take, skip);
  }

  @ApiOperation({
    summary: 'Получение конкретного объекта'
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (isUUID(id)) {
      return this.objectsService.findOne({ id });
    } else {
      throw new BadRequestException('Невалидный идентификатор');
    }
  }
}
