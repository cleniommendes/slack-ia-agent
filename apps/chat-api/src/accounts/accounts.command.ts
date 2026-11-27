import { Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { DomainError } from '../common/errors/domain.error.js';
import { PeopleService } from '../people/people.service.js';
import type { PasswordPrompt } from './password-prompt.js';

export interface CommandResult {
  ok: boolean;
  message: string;
}

const USAGE = 'Uso: accounts create <e-mail> <nome>';

/** O comando de contas, chamado pelo `accounts.cli.ts` e pelos testes. */
@Injectable()
export class AccountsCommand {
  constructor(private readonly people: PeopleService) {}

  async run(argv: string[], prompt: PasswordPrompt): Promise<CommandResult> {
    const [operation, ...args] = argv;

    if (operation === 'create') {
      return this.create(args, prompt);
    }
    return { ok: false, message: USAGE };
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
      return { ok: false, message: 'A senha não pode ser vazia.' };
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
