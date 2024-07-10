import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@resources/auth/guards';
import {
  AccountRelationsDto,
  CreateAccountDto,
  FindAccountsQuery,
} from '../dto';

@ApiTags('accounts')
@Controller('accounts')
// @UseGuards(AuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Body() payload: CreateAccountDto) {
    return this.accountsService.create(payload);
  }

  @Get()
  async find(@Body() payload: FindAccountsQuery) {
    return this.accountsService.find(payload);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() payload: AccountRelationsDto,
  ) {
    return this.accountsService.findOne({ id, ...payload });
  }

  @Put()
  async update(@Body() payload) {}
}
