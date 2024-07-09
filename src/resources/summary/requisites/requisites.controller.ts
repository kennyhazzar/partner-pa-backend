import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RequisitesService } from './requisites.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateRequisitesDto,
  FindRequisitesQuery,
  UpdateEntityRequisitesDto,
} from '../dto';

@ApiTags('requisites')
@Controller('requisites')
export class RequisitesController {
  constructor(private readonly requisitesService: RequisitesService) {}

  @Post()
  async create(@Body() payload: CreateRequisitesDto) {
    return this.requisitesService.create(payload);
  }

  @Get()
  async find(@Query() payload: UpdateEntityRequisitesDto) {
    return this.requisitesService.findByEntity(payload);
  }

  @Get(':id')
  async findOneByRequisiteId(@Param() { id }: FindRequisitesQuery) {
    return this.requisitesService.findOneByRequisiteId(id);
  }

  @Delete('id')
  async delete(@Param() { id }: FindRequisitesQuery) {
    return this.requisitesService.delete(id);
  }
}
