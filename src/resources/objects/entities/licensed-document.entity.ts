import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LicensedObject } from './licensed-object.entity';
import { PrimaryUuidBaseEntity } from '@core/db';

@Entity()
export class LicensedDocument extends PrimaryUuidBaseEntity {
  @Column()
  documentName: string;

  @Column()
  documentType: string;

  @ManyToOne(
    () => LicensedObject,
    (licensedObject) => licensedObject.licensedDocuments,
  )
  licensedObject: LicensedObject;
}
