import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RequisitesService } from './requisites.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateRequisitesDto,
  FindRequisitesQuery,
  UpdateEntityRequisitesDto,
} from '../dto';

@ApiBearerAuth()
@ApiTags('requisites')
@Controller('requisites')
export class RequisitesController {
  constructor(private readonly requisitesService: RequisitesService) {}

  @ApiOperation({
    summary: 'Создание реквизитов',
    description:
      'Можно связать с объектом, партнером, менеджером, а также сменить ид целевых реквизитов',
  })
  @ApiBody({
    type: CreateRequisitesDto,
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() payload: CreateRequisitesDto) {
    return this.requisitesService.create(payload);
  }

  @ApiOperation({
    summary: 'Получение списка реквизитов',
    description: 'Ответ смотреть в коде бека (позже допилю) хд',
  })
  @Get()
  async find(@Query() payload: UpdateEntityRequisitesDto) {
    return this.requisitesService.findByEntity(payload);
  }

  @ApiOperation({
    summary: 'Получение реквизитов по ид',
  })
  @Get(':id')
  async findOneByRequisiteId(@Param() { id }: FindRequisitesQuery) {
    return this.requisitesService.findOneByRequisiteId(id);
  }

  @ApiOperation({
    summary: 'Удаление реквизитов по ид',
  })
  @Delete('id')
  async delete(@Param() { id }: FindRequisitesQuery) {
    return this.requisitesService.delete(id);
  }
}
