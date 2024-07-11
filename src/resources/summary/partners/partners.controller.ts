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
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from '../dto';
import { isUUID } from 'class-validator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @ApiOperation({
    summary: 'Создание партнера',
  })
  @ApiBody({
    type: CreatePartnerDto,
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() payload: CreatePartnerDto) {
    return this.partnersService.create(payload);
  }

  @ApiOperation({
    summary: 'Получение списка партнеров',
  })
  @Get()
  async find(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.partnersService.find(take, skip);
  }

  @ApiOperation({
    summary: 'Получение конкретного партнера',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (isUUID(id)) {
      return this.partnersService.findOne(id);
    } else {
      throw new BadRequestException('Невалидный идентификатор');
    }
  }
}
