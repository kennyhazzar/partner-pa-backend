import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { PrimaryUuidBaseEntity } from '@core/db';

@Entity()
export class RefreshToken extends PrimaryUuidBaseEntity {
  @Column()
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn()
  user: User;
}
