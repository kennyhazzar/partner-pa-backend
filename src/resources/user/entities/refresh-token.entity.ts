import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { PrimaryUuidBaseEntity } from '@core/db';

@Entity()
export class RefreshToken extends PrimaryUuidBaseEntity {
  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
