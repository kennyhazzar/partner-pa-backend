import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { CreateObjectDto, FindObjectsQuery } from '../dto/object.dto';
import { AuthGuard } from '@resources/auth/guards';
import { ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';

@ApiTags('objects')
@Controller('objects')
// @UseGuards(AuthGuard)
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  async create(@Body() payload: CreateObjectDto) {
    return this.objectsService.create(payload);
  }

  @Get()
  async find(
    @Query() query: FindObjectsQuery,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.objectsService.find(query, take, skip);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (isUUID(id)) {
      return this.objectsService.findOne({ id });
    } else {
      throw new BadRequestException('Невалидный идентификатор');
    }
  }
}
