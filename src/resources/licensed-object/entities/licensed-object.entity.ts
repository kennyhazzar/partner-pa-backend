import { BaseEntity } from '@core/db';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { LicensedDocument } from './licensed-document.entity';
import { AdditionalService } from './additional-service.entity';
import { Franchise } from './franchise.entity';
import { Partner } from './partner.entity';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';
import { Finance } from './finance.entity';

@Entity()
export class LicensedObject extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  itn: string;

  @Column()
  kpp: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  legalEntity: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  storeCreationDate: Date;

  @ManyToOne(() => Franchise, { nullable: true })
  franchise: Franchise;

  @ManyToOne(() => Partner, { nullable: true })
  partner: Partner;

  @ManyToOne(() => User, { nullable: true })
  manager: User;

  @ManyToMany(() => Subscription)
  @JoinTable()
  subscriptions: Subscription[];

  @OneToMany(() => LicensedDocument, licensedDocument => licensedDocument.licensedObject)
  licensedDocuments: LicensedDocument[];

  @OneToMany(() => AdditionalService, additionalService => additionalService.licensedObject)
  additionalServices: AdditionalService[];

  @OneToMany(() => Finance, finance => finance.licensedObject)
  finances: Finance[];
}
