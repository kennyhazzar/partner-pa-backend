import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PrimaryIncrementBaseEntity } from '@core/db';
import { User } from '@resources/user/entities';
import { LicensedDocument } from './licensed-document.entity';
import { Partner } from '@resources/partners/entities';

@Entity()
export class LicensedObject extends PrimaryIncrementBaseEntity {
  @Column()
  title: string;

  @Column()
  inn: string;

  @Column({ nullable: true })
  kpp?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  dateOfEstablishment?: Date;

  @ManyToOne(() => User, (user) => user.licensedObjects, { nullable: true })
  manager?: User;

  @OneToMany(
    () => LicensedDocument,
    (licensedDocument) => licensedDocument.licensedObject,
  )
  licensedDocuments: LicensedDocument[];

  @ManyToOne(() => Partner, (partner) => partner.commissions)
  partner: Partner;
}
