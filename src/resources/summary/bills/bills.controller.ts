import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillWithRelationsDto } from '../dto/bill.dto';
import { isNotEmptyObject } from 'class-validator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@resources/auth/guards';

@ApiBearerAuth()
@ApiTags('bills')
@Controller('bills')
@UseGuards(AuthGuard)
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @ApiOperation({
    summary: 'Создание счета/отчета/лицензии/подписки',
  })
  @ApiBody({
    type: CreateBillWithRelationsDto,
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() payload: CreateBillWithRelationsDto) {
    if (!isNotEmptyObject(payload)) {
      throw new BadRequestException();
    }

    return this.billsService.create(payload);
  }

  @Get()
  async find() {
    return this.billsService.find();
  }
}
