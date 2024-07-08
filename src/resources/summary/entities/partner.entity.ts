import { Column, Entity, OneToMany } from 'typeorm';
import { PrimaryUuidBaseEntity } from '@core/db';
import { EntityRequisites } from './entity-requisites.entity';
import { Commission } from './commission.entity';
import { Manager } from './manager.entity';
import { LicensedObject } from './licensed-object.entity';
import { Account } from './account.entity';

@Entity()
export class Partner extends PrimaryUuidBaseEntity {
  @Column()
  title: string;

  @OneToMany(() => Commission, (commission) => commission.partner)
  commissions: Commission[];

  @OneToMany(() => Manager, (manager) => manager.partner)
  managers: Manager[];

  @OneToMany(() => LicensedObject, (object) => object.partner)
  licensedObjects: LicensedObject[];

  @OneToMany(() => Account, (account) => account.partner)
  accounts: Account[];

  @OneToMany(() => EntityRequisites, (requisites) => requisites.object)
  requisites: EntityRequisites[];
}
