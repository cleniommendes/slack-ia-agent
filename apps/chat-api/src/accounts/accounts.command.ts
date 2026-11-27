import { Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { DataSource } from 'typeorm';
import { DomainError } from '../common/errors/domain.error.js';
import { PeopleService } from '../people/people.service.js';
import { SessionsService } from '../sessions/sessions.service.js';
import type { PasswordPrompt } from './password-prompt.js';

export interface CommandResult {
  ok: boolean;
  message: string;
}

const USAGE =
  'Uso: accounts create <e-mail> <nome> | reset-password <e-mail> | revoke-sessions <e-mail> | purge-expired-sessions';
const NO_ACCOUNT = 'Não existe conta com este e-mail.';
const EMPTY_PASSWORD = 'A senha não pode ser vazia.';

function sessionsRevoked(count: number): string {
  if (count === 0) return 'Nenhuma Sessão revogada.';
  return count === 1 ? '1 Sessão revogada.' : `${count} Sessões revogadas.`;
}

/** O comando de contas, chamado pelo `accounts.cli.ts` e pelos testes. */
@Injectable()
export class AccountsCommand {
  constructor(
    private readonly people: PeopleService,
    private readonly sessions: SessionsService,
    private readonly dataSource: DataSource,
  ) {}

  async run(argv: string[], prompt: PasswordPrompt): Promise<CommandResult> {
    const [operation, ...args] = argv;

    if (operation === 'create') {
      return this.create(args, prompt);
    }
    if (operation === 'revoke-sessions') {
      return this.revokeSessions(args);
    }
    if (operation === 'reset-password') {
      return this.resetPassword(args, prompt);
    }
    if (operation === 'purge-expired-sessions') {
      return this.purgeExpiredSessions(args);
    }
    return { ok: false, message: USAGE };
  }

  private async revokeSessions(args: string[]): Promise<CommandResult> {
    const [email, ...extra] = args;
    if (!email || extra.length > 0) {
      return { ok: false, message: USAGE };
    }

    const person = await this.people.findByEmail(email);
    if (!person) {
      return { ok: false, message: NO_ACCOUNT };
    }

    const count = await this.sessions.revokeAll(person.id);
    if (count === 0) {
      return {
        ok: true,
        message: `Nenhuma Sessão ativa para ${person.email}.`,
      };
    }
    return {
      ok: true,
      message: `${sessionsRevoked(count).replace(/\.$/, '')} para ${person.email}.`,
    };
  }

  /** Troca o hash e revoga as Sessões na mesma transação: ou as duas valem, ou nenhuma. */
  private async resetPassword(
    args: string[],
    prompt: PasswordPrompt,
  ): Promise<CommandResult> {
    const [email, ...extra] = args;
    if (!email || extra.length > 0) {
      return { ok: false, message: USAGE };
    }

    const person = await this.people.findByEmail(email);
    if (!person) {
      return { ok: false, message: NO_ACCOUNT };
    }

    const password = await prompt.read('Senha nova');
    if (!password) {
      return { ok: false, message: EMPTY_PASSWORD };
    }

    const count = await this.dataSource.transaction(async (manager) => {
      await this.people.setPassword(person.id, password, manager);
      return this.sessions.revokeAll(person.id, manager);
    });
    return {
      ok: true,
      message: `Senha redefinida para ${person.email}. ${sessionsRevoked(count)}`,
    };
  }

  private async purgeExpiredSessions(args: string[]): Promise<CommandResult> {
    if (args.length > 0) {
      return { ok: false, message: USAGE };
    }

    const count = await this.sessions.purgeExpired();
    if (count === 0) {
      return { ok: true, message: 'Nenhuma Sessão vencida.' };
    }
    return {
      ok: true,
      message:
        count === 1
          ? '1 Sessão vencida apagada.'
          : `${count} Sessões vencidas apagadas.`,
    };
  }

  private async create(
    args: string[],
    prompt: PasswordPrompt,
  ): Promise<CommandResult> {
    const [email, ...nameWords] = args;
    const name = nameWords.join(' ').trim();
    if (!email || !isEmail(email.trim()) || !name) {
      return { ok: false, message: USAGE };
    }

    const password = await prompt.read('Senha');
    if (!password) {
      return { ok: false, message: EMPTY_PASSWORD };
    }

    try {
      const person = await this.people.create({ email, name, password });
      return { ok: true, message: `Conta criada para ${person.email}.` };
    } catch (error) {
      if (error instanceof DomainError) {
        return { ok: false, message: error.message };
      }
      throw error;
    }
  }
}
