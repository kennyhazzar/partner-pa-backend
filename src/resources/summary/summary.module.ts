import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { PartnersController } from './partners/partners.controller';
import { PartnersService } from './partners/partners.service';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsService } from './accounts/accounts.service';
import { ManagersController } from './managers/managers.controller';
import { ManagersService } from './managers/managers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicensedObject, Manager, Requisites } from './entities';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Manager, LicensedObject, Requisites]),
  ],
  controllers: [
    ProductsController,
    PartnersController,
    AccountsController,
    ManagersController,
  ],
  providers: [
    ProductsService,
    PartnersService,
    AccountsService,
    ManagersService,
  ],
})
export class SummaryModule {}
