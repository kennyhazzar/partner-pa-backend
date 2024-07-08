import { PrimaryUuidBaseEntity } from '@core/db';
import { ManyToOne, JoinColumn, Entity } from 'typeorm';
import { Requisites } from './requisites.entity';
import { LicensedObject } from './licensed-object.entity';
import { Partner } from './partner.entity';
import { Account } from './account.entity';

@Entity()
export class EntityRequisites extends PrimaryUuidBaseEntity {
  @ManyToOne(() => Requisites)
  @JoinColumn()
  requisites: Requisites;

  @ManyToOne(() => LicensedObject, (object) => object.requisites, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  object?: LicensedObject;

  @ManyToOne(() => Partner, (partner) => partner.requisites, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  partner?: Partner;

  @ManyToOne(() => Account, (account) => account.requisites, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  account?: Account;
}
