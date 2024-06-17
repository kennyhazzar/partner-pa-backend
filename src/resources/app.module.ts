import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, TypeormConfig } from '@core/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LicensedDocumentModule } from './licensed-document/licensed-document.module';
import { LicensedObjectModule } from './licensed-object/licensed-object.module';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    TypeOrmModule.forRootAsync(TypeormConfig),
    UserModule,
    AuthModule,
    LicensedDocumentModule,
    LicensedObjectModule,
  ],
})
export class AppModule {}
