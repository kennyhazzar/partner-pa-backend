import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@resources/auth/guards';
import { CreateAccountDto, FindAccountsQuery } from '../dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() payload: CreateAccountDto) {
    return this.accountsService.create(payload);
  }

  @Get()
  // @UseGuards(AuthGuard)
  async find(@Body() payload: FindAccountsQuery) {
    return this.accountsService.find(payload);
  }

  @Put()
  async update(@Body() payload) {}
}
