import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities';
import { CacheConfig } from '@core/configs';
import { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { EntityService } from '@core/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    CacheModule.registerAsync<RedisClientOptions>(CacheConfig),
  ],
  controllers: [UserController],
  providers: [UserService, EntityService],
  exports: [UserService],
})
export class UserModule {}
