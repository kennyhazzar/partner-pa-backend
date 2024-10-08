import { Entity, Column, ManyToOne, JoinColumn, Generated } from 'typeorm';
import { LicensedObject } from './licensed-object.entity';
import { PrimaryUuidBaseEntity } from '@core/db';
import { Manager } from './manager.entity';
import { InvoiceStatus } from '@core/types';

@Entity()
export class Bill extends PrimaryUuidBaseEntity {
  @Column({ name: 'document_name', nullable: true })
  documentName?: string;

  @Column({ name: 'document_path', nullable: true })
  documentPath?: string;

  @Column({ name: 'account_number' })
  @Generated('increment')
  accountNumber: number;

  @Column({ name: 'invoice_amount', nullable: true })
  invoiceAmount: number;

  @Column({ name: 'payment_amount', nullable: true })
  paymentAmount: number;

  @Column({
    name: 'invoice_status',
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.NOT_PAID,
  })
  invoiceStatus: InvoiceStatus;

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
