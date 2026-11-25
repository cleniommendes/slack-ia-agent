import { randomUUIDv7 } from 'node:crypto';
import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

/** Entidade base: id UUID v7 gerado na aplicação e datas em `timestamptz`. */
export abstract class AppBaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @BeforeInsert()
  generateId(): void {
    this.id ||= randomUUIDv7();
  }
}
