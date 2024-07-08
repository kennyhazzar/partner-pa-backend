import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PrimaryUuidBaseEntity } from '@core/db';

@Entity()
export class Requisites extends PrimaryUuidBaseEntity {
  @Column({ unique: true, nullable: true })
  inn?: string;

  @Column({ unique: true, nullable: true })
  kpp?: string;

  @Column({ name: 'company_name', nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  address?: string;
}
