import { Column, Entity, ManyToOne } from 'typeorm';
import { PrimaryUuidBaseEntity } from '@core/db';
import { Partner } from '@resources/partners/entities';

@Entity({ comment: 'Комиссии предприятий и менеджеров' })
export class Commission extends PrimaryUuidBaseEntity {
  @Column()
  enterpriseCommission: number;

  @Column()
  managerCommission: number;

  @ManyToOne(() => Partner, partner => partner.commissions)
  partner: Partner;
}