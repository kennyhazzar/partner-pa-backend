import { PrimaryUuidBaseEntity } from '@core/db';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityRequisites } from './entity-requisites.entity';
import { Partner } from './partner.entity';
import { LicensedObject } from './licensed-object.entity';
import { Manager } from './manager.entity';
import { Software } from './software.entity';

@Entity()
export class Account extends PrimaryUuidBaseEntity {
  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  franchise?: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => EntityRequisites, (requisites) => requisites.account, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  requisites: EntityRequisites[];

  @OneToMany(() => LicensedObject, (object) => object.account, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  licensedObjects: LicensedObject[];

  @ManyToOne(() => Manager, (manager) => manager.accounts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  manager: Manager;

  @ManyToOne(() => Partner, (partner) => partner.accounts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  partner: Partner;

  @ManyToOne(() => Software, (software) => software.accounts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  software: Software;
}
