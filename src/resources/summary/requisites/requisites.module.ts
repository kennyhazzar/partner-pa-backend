import { Module } from '@nestjs/common';
import { RequisitesService } from './requisites.service';
import { RequisitesController } from './requisites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityRequisites, Requisites } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Requisites, EntityRequisites])],
  controllers: [RequisitesController],
  providers: [RequisitesService],
})
export class RequisitesModule {}
