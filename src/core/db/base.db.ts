import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class DateBaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export abstract class PrimaryUuidBaseEntity extends DateBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export abstract class PrimaryIncrementBaseEntity extends DateBaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
