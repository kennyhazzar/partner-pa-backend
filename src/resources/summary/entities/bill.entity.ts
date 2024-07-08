import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LicensedObject } from './licensed-object.entity';
import { PrimaryUuidBaseEntity } from '@core/db';
import { Manager } from './manager.entity';

@Entity()
export class Bill extends PrimaryUuidBaseEntity {
  @Column({ name: 'document_name' })
  documentName: string;

  @Column({ name: 'document_path' })
  documentPath: string;

  @Column({ name: 'account_number' })
  accountNumber: string;

  @Column({ name: 'invoice_amount' })
  invoiceAmount: number;

  @Column({ name: 'payment_amount' })
  paymentAmount: number;

  @Column({ name: 'invoice_status' })
  invoiceStatus: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @ManyToOne(
    () => LicensedObject,
    (licensedObject) => licensedObject.licensedDocuments,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn()
  licensedObject: LicensedObject;

  @ManyToOne(() => Manager, (manager) => manager.bills, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  manager: Manager;
}
