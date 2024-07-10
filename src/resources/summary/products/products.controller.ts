import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateSoftwareDto } from '../dto';
import { AuthGuard } from '@resources/auth/guards';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(payload: CreateSoftwareDto) {
    return this.productsService.create(payload);
  }

  @Get()
  async find() {
    return this.productsService.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
