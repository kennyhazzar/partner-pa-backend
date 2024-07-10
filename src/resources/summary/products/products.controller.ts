import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateSoftwareDto, FindSoftwareResponse } from '../dto';
import { AuthGuard } from '@resources/auth/guards';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Создание ПО'
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(payload: CreateSoftwareDto) {
    return this.productsService.create(payload);
  }

  @ApiOperation({
    summary: 'Список ПО'
  })
  @ApiResponse({
    type: FindSoftwareResponse,
    isArray: true,
  })
  @Get()
  async find(): Promise<Array<FindSoftwareResponse>> {
    return this.productsService.find();
  }

  @ApiOperation({
    summary: 'Конкретное ПО по ид'
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
