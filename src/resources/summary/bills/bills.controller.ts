import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillWithRelationsDto } from '../dto/bill.dto';
import { isNotEmptyObject } from 'class-validator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('bills')
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @ApiOperation({
    summary: 'Создание счета/отчета/лицензии/подписки'
  })
  @ApiBody({
    type: CreateBillWithRelationsDto,
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() payload: CreateBillWithRelationsDto) {
    console.log(payload);
    
    if (!isNotEmptyObject(payload)) {
      throw new BadRequestException();
    }

    return this.billsService.create(payload);
  }
}
