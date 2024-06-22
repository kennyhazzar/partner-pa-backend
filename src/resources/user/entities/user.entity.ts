import { PrimaryUuidBaseEntity } from '@core/db';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { LicensedObject } from '@resources/objects/entities';
import { UserRole } from '@core/types';
import { Partner } from '@resources/partners/entities';

@Entity()
export class User extends PrimaryUuidBaseEntity {
  @Column({ unique: true, nullable: true })
  email: string;

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

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  secondName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => LicensedObject, (licensedObject) => licensedObject.manager)
  licensedObjects: LicensedObject[];

  @ManyToOne(() => Partner, (partner) => partner.managers)
  partner: Partner;
}
