import { Module } from '@nestjs/common';
import { LicensedObjectService } from './licensed-object.service';
import { LicensedObjectController } from './licensed-object.controller';

@Module({
  controllers: [LicensedObjectController],
  providers: [LicensedObjectService],
})
export class LicensedObjectModule {}
