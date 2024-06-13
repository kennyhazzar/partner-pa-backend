import { BaseEntity } from '@core/db';
import { Column, Entity, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Entity()
export class User extends BaseEntity {
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

  @Column({ default: 'user' })
  role: string; //!TODO: Сделать енам с ролями

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
