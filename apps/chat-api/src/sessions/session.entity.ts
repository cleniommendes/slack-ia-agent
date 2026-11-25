import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../database/base.entity.js';
import { Person } from '../people/person.entity.js';

/** Uma Sessão de uma Pessoa num navegador. O banco guarda só o SHA-256 do token. */
@Entity('sessions')
export class Session extends AppBaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  personId!: string;

  @ManyToOne(() => Person, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'person_id' })
  person!: Person;

  @Column({ type: 'text', unique: true })
  tokenHash!: string;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  lastUsedAt!: Date;
}
