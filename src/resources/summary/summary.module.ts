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
import {
  Account,
  EntityRequisites,
  LicensedObject,
  Manager,
  Partner,
  Requisites,
} from './entities';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ObjectsService } from './objects/objects.service';
import { ObjectsController } from './objects/objects.controller';
import { EntityService } from '@core/services';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { CacheConfig } from '@core/configs';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([
      Manager,
      LicensedObject,
      Requisites,
      EntityRequisites,
      Partner,
      Account,
    ]),
    CacheModule.registerAsync<RedisClientOptions>(CacheConfig),
  ],
  controllers: [
    ProductsController,
    PartnersController,
    AccountsController,
    ManagersController,
    ObjectsController,
  ],
  providers: [
    EntityService,
    ProductsService,
    PartnersService,
    AccountsService,
    ManagersService,
    ObjectsService,
  ],
})
export class SummaryModule {}
