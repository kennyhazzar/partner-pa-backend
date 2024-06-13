import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, TypeormConfig } from '@core/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    TypeOrmModule.forRootAsync(TypeormConfig),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
