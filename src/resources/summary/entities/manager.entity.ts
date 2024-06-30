import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PrimaryUuidBaseEntity } from '@core/db';
import { EntityRequisites } from './entity-requisites.entity';
import { User } from '@resources/user/entities';
import { Partner } from './partner.entity';
import { LicensedObject } from './licensed-object.entity';
import { Account } from './account.entity';
import { Bill } from './bill.entity';

@Entity()
export class Manager extends PrimaryUuidBaseEntity {
  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'second_name', nullable: true })
  secondName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  userAccount?: User;

  @ManyToOne(() => Partner, (partner) => partner.managers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  partner?: Partner;

  @OneToMany(() => Account, (account) => account.manager)
  accounts?: Account;

  @OneToMany(() => LicensedObject, (object) => object.manager)
  licensedObjects?: LicensedObject[];

  @OneToMany(() => EntityRequisites, (requisites) => requisites.object)
  requisites?: EntityRequisites[];

  @OneToMany(() => Bill, (bill) => bill.manager)
  bills?: Bill[];
}
