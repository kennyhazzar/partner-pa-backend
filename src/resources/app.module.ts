import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, ThrottlerConfig, TypeormConfig } from '@core/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    TypeOrmModule.forRootAsync(TypeormConfig),
    ThrottlerModule.forRootAsync(ThrottlerConfig),
    UserModule,
    AuthModule,
    SummaryModule,
  ],
})
export class AppModule {}
