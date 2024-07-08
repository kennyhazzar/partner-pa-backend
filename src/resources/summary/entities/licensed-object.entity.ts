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

  @Column({ default: false })
  isActive: boolean;

  @Column({ name: 'date_of_establishment', nullable: true })
  dateOfEstablishment?: Date;

  @ManyToOne(() => Partner, (partner) => partner.licensedObjects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  partner: Partner;

  @ManyToOne(() => Manager, (manager) => manager.licensedObjects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  manager: Manager;

  @ManyToOne(() => Account, (account) => account.licensedObjects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  account: Account;

  @OneToMany(() => Bill, (bill) => bill.licensedObject, {
    onDelete: 'SET NULL',
  })
  licensedDocuments: Bill[];

  @OneToMany(() => EntityRequisites, (requisites) => requisites.object, {
    onDelete: 'SET NULL',
  })
  requisites: EntityRequisites[];
}
