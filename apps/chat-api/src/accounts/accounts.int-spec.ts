import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { verify } from '@node-rs/argon2';
import type { TestingModule } from '@nestjs/testing';
import type { Repository } from 'typeorm';
import { AppModule } from '../app.module.js';
import { Person } from '../people/person.entity.js';
import { uniqueEmail } from '../../test/support/unique-email.js';
import { AccountsCommand } from './accounts.command.js';
import type { PasswordPrompt } from './password-prompt.js';

const PASSWORD = 'senha-do-terminal-123';

const prompt: PasswordPrompt = { read: async () => PASSWORD };

describe('Comando de contas', () => {
  let moduleRef: TestingModule;
  let command: AccountsCommand;
  let people: Repository<Person>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    command = moduleRef.get(AccountsCommand, { strict: false });
    people = moduleRef.get(getRepositoryToken(Person), { strict: false });
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('cria a Pessoa com a senha em Argon2id', async () => {
    const email = uniqueEmail();

    const result = await command.run(['create', email, 'Ana', 'Souza'], prompt);

    const person = await people.findOneByOrFail({ email });
    expect(result.ok).toBe(true);
    expect(result.message).toContain(email);
    expect(person.name).toBe('Ana Souza');
    expect(person.passwordHash).toMatch(/^\$argon2id\$/);
    expect(await verify(person.passwordHash, PASSWORD)).toBe(true);
  });

  it('recusa um e-mail que já existe, com mensagem', async () => {
    const email = uniqueEmail();
    await command.run(['create', email, 'Ana'], prompt);

    const result = await command.run(
      ['create', email.toUpperCase(), 'Outra Ana'],
      prompt,
    );

    expect(result).toEqual({
      ok: false,
      message: 'Já existe uma conta com este e-mail.',
    });
    expect(await people.countBy({ email })).toBe(1);
  });
});
