import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagerDto } from '../dto/manager.dto';
import { AuthGuard } from '../../auth/guards';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  // @UseGuards(AuthGuard)
  createManager(@Body() payload: ManagerDto) {
    return this.managersService.create(payload);
  }

  @Get()
  @UseGuards(AuthGuard)
  findManyManagers() {}
}
