import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@resources/auth/guards';
import {
  AccountRelationsDto,
  CreateAccountDto,
  FindAccountsQuery,
  FindAccountsResponse,
  UpdateSoftwareAccountDto,
} from '../dto';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({
    summary: 'Создание аккаунта',
  })
  @ApiBody({
    type: CreateAccountDto,
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() payload: CreateAccountDto) {
    return this.accountsService.create(payload);
  }

  @ApiOperation({
    summary: 'Список аккаунтов',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FindAccountsResponse,
    isArray: true,
  })
  @Get()
  async find(@Query() payload: FindAccountsQuery): Promise<Array<FindAccountsResponse>> {
    return this.accountsService.find(payload);
  }

  @ApiOperation({
    summary: 'Получить один аккаунт'
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() payload: AccountRelationsDto,
  ) {
    return this.accountsService.findOne({ id, ...payload });
  }

  @ApiOperation({
    summary: 'Добавление ПО к аккаунту',
    description: 'Требуется, чтобы в списке ПО отображались аккаунты'
  })
  @ApiBody({
    type: UpdateSoftwareAccountDto,
  })
  @Put(':id/software')
  async updateSoftware(
    @Param('id') id: string,
    @Body() payload: UpdateSoftwareAccountDto,
  ) {
    return this.accountsService.updateSoftware(id, payload);
  }
}
