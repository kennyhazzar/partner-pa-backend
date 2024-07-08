import { PrimaryUuidBaseEntity } from '@core/db';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { UserRole } from '@core/types';
import { Manager } from '../../summary/entities';

@Entity()
export class User extends PrimaryUuidBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({
    type: 'decimal',
    unsigned: true,
    unique: true,
    comment: 'Individual Taxpayer Number (ITN/INN)',
    nullable: true,
  })
  itn: number;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'second_name', nullable: true })
  secondName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ name: 'is_email_confirmed', default: false })
  isEmailConfirmed: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToOne(() => Manager, (manager) => manager.userAccount)
  @JoinColumn()
  managerAccount: Manager;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
