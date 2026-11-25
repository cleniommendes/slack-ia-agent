import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import type { Env } from '../config/env.schema.js';
import { PeopleService } from '../people/people.service.js';
import type { Person } from '../people/person.entity.js';
import { InvalidCredentialsError } from './invalid-credentials.error.js';
import { Session } from './session.entity.js';
import { UnauthenticatedError } from './unauthenticated.error.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const TOKEN_BYTES = 32;

export interface LoginResult {
  token: string;
  person: Person;
}

@Injectable()
export class SessionsService {
  /** Hash de uma senha qualquer, para o e-mail sem conta gastar o mesmo tempo de uma conta. */
  private dummyHash?: Promise<string>;

  constructor(
    @InjectRepository(Session) private readonly sessions: Repository<Session>,
    private readonly people: PeopleService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const person = await this.people.findByEmail(email);
    const passwordHash = person?.passwordHash ?? (await this.getDummyHash());
    const isValid = await this.people.verifyPassword(passwordHash, password);

    if (!person || !isValid) {
      throw new InvalidCredentialsError();
    }

    const token = randomBytes(TOKEN_BYTES).toString('base64url');
    const ttlDays = this.config.get('SESSION_TTL_DAYS', { infer: true });
    await this.sessions.save(
      this.sessions.create({
        personId: person.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + ttlDays * DAY_MS),
        lastUsedAt: new Date(),
      }),
    );

    return { token, person };
  }

  /** A Pessoa da Sessão do token. Renovar e apagar a vencida são da F01-T06. */
  async verify(token: string): Promise<Person> {
    const session = await this.sessions.findOne({
      where: { tokenHash: hashToken(token) },
      relations: { person: true },
    });

    if (!session || session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthenticatedError();
    }
    return session.person;
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= this.people.hashPassword('senha-fictícia');
    return this.dummyHash;
  }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
