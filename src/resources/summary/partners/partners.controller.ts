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
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from '../dto';
import { isUUID } from 'class-validator';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  async create(@Body() payload: CreatePartnerDto) {
    return this.partnersService.create(payload);
  }

  @Get()
  async find(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.partnersService.find(take, skip);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (isUUID(id)) {
      return this.partnersService.findOne(id);
    } else {
      throw new BadRequestException('Невалидный идентификатор');
    }
  }
}
