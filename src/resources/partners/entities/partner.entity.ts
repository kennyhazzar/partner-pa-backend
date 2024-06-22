import { Column, Entity, OneToMany } from 'typeorm';
import { PrimaryIncrementBaseEntity } from '@core/db';
import { User } from '@resources/user/entities';
import { Commission } from '@resources/objects/entities';

@Entity()
export class Partner extends PrimaryIncrementBaseEntity {
  @Column()
  title: string;

  @Column()
  inn: string;

  @Column({ nullable: true })
  kpp?: string;

  @OneToMany(() => User, (user) => user.partner)
  managers: User[];

  @OneToMany(() => Commission, (commission) => commission.partner)
  commissions: Commission[];
}
