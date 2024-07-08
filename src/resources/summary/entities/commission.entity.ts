import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PrimaryUuidBaseEntity } from '@core/db';
import { Partner } from './partner.entity';

@Entity({ comment: 'Комиссии предприятий и менеджеров' })
export class Commission extends PrimaryUuidBaseEntity {
  @Column({ name: 'enterprise_commission' })
  enterpriseCommission: number;

  @Column({ name: 'manager_commission' })
  managerCommission: number;

  @ManyToOne(() => Partner, (partner) => partner.commissions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  partner: Partner;
}
