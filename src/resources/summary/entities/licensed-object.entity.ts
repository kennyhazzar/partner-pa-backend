import { PrimaryUuidBaseEntity } from '@core/db';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityRequisites } from './entity-requisites.entity';
import { Bill } from './bill.entity';
import { Partner } from './partner.entity';
import { Manager } from './manager.entity';
import { Account } from './account.entity';

@Entity()
export class LicensedObject extends PrimaryUuidBaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ name: 'date_of_establishment', nullable: true })
  dateOfEstablishment?: Date;

  @ManyToOne(() => Partner, (partner) => partner.licensedObjects, {
    nullable: true,
  })
  @JoinColumn()
  partner: Partner;

  @ManyToOne(() => Manager, (manager) => manager.licensedObjects, {
    nullable: true,
  })
  @JoinColumn()
  manager: Manager;

  @ManyToOne(() => Account, (account) => account.licensedObjects, {
    nullable: true,
  })
  @JoinColumn()
  account: Account;

  @OneToMany(() => Bill, (bill) => bill.licensedObject)
  licensedDocuments: Bill[];

  @OneToMany(() => EntityRequisites, (requisites) => requisites.object)
  requisites: EntityRequisites[];
}
