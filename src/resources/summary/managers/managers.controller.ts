import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagerDto } from '../dto/manager.dto';
import { AuthGuard } from '../../auth/guards';
import { isUUID } from 'class-validator';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

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
      return this.managersService.findOne(id)
    }
  }
}
