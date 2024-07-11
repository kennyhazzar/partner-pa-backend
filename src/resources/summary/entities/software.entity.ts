import { Column, Entity, OneToMany } from 'typeorm';
import { PrimaryUuidBaseEntity } from '../../../core';
import { Account } from './account.entity';

@Entity()
export class Software extends PrimaryUuidBaseEntity {
  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  owner?: string;

  @OneToMany(() => Account, (account) => account.software, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  accounts: Account[];
}
