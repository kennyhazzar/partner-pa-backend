import { PrimaryUuidBaseEntity } from '@core/db';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityRequisites } from './entity-requisites.entity';
import { Partner } from './partner.entity';
import { LicensedObject } from './licensed-object.entity';
import { Manager } from './manager.entity';

@Entity()
export class Account extends PrimaryUuidBaseEntity {
  @OneToMany(() => EntityRequisites, (requisites) => requisites.account)
  requisites: EntityRequisites[];

  @OneToMany(() => LicensedObject, (object) => object.account)
  licensedObjects: LicensedObject[];

  @ManyToOne(() => Manager, (manager) => manager.accounts)
  @JoinColumn()
  manager: Manager;

  @ManyToOne(() => Partner, (partner) => partner.accounts)
  @JoinColumn()
  partner: Partner;
}
