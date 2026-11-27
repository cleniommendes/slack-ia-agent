import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { EntityManager, LessThanOrEqual, Repository } from 'typeorm';
import type { Env } from '../config/env.schema.js';
import { PeopleService } from '../people/people.service.js';
import type { Person } from '../people/person.entity.js';
import { InvalidCredentialsError } from './invalid-credentials.error.js';
import { Session } from './session.entity.js';
import { UnauthenticatedError } from './unauthenticated.error.js';

const DAY_MS = 24 * 60 * 60 * 1000;
/** Intervalo de renovação da Sessão (LLD, "Valores e configuração"). */
export const SESSION_RENEWAL_INTERVAL_MS = DAY_MS;
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

  /**
   * A Pessoa da Sessão do token. A vencida é apagada na hora, e a válida é renovada quando passou
   * o intervalo de renovação desde o último uso.
   */
  async verify(token: string): Promise<Person> {
    const session = await this.sessions.findOne({
      where: { tokenHash: hashToken(token) },
      relations: { person: true },
    });
    if (!session) {
      throw new UnauthenticatedError();
    }

    const now = Date.now();
    if (session.expiresAt.getTime() <= now) {
      await this.sessions.delete({ id: session.id });
      throw new UnauthenticatedError();
    }

    await this.renewIfDue(session, now);
    return session.person;
  }

  /** Apaga todas as Sessões da Pessoa e devolve quantas eram. */
  async revokeAll(personId: string, manager?: EntityManager): Promise<number> {
    const repository = manager?.getRepository(Session) ?? this.sessions;
    const result = await repository.delete({ personId });
    return result.affected ?? 0;
  }

  /** Apaga as Sessões vencidas e devolve quantas eram. */
  async purgeExpired(): Promise<number> {
    const result = await this.sessions.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
    return result.affected ?? 0;
  }

  /**
   * O `WHERE` repete a condição na escrita: duas requisições com a mesma Sessão velha gravam
   * uma vez só, e o banco recebe no máximo uma escrita por Sessão a cada intervalo.
   */
  private async renewIfDue(session: Session, now: number): Promise<void> {
    if (now - session.lastUsedAt.getTime() < SESSION_RENEWAL_INTERVAL_MS) {
      return;
    }
    const ttlDays = this.config.get('SESSION_TTL_DAYS', { infer: true });
    await this.sessions.update(
      {
        id: session.id,
        lastUsedAt: LessThanOrEqual(
          new Date(now - SESSION_RENEWAL_INTERVAL_MS),
        ),
      },
      {
        expiresAt: new Date(now + ttlDays * DAY_MS),
        lastUsedAt: new Date(now),
      },
    );
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= this.people.hashPassword('senha-fictícia');
    return this.dummyHash;
  }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
