import { Check, Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../database/base.entity.js';

/** Uma Pessoa com conta. O e-mail é gravado já normalizado (sem espaços e em minúsculas). */
@Entity('people')
@Check('people_email_normalized', 'email = lower(btrim(email))')
export class Person extends AppBaseEntity {
  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  passwordHash!: string;
}
