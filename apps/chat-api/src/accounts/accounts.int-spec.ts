import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { verify } from '@node-rs/argon2';
import type { TestingModule } from '@nestjs/testing';
import type { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module.js';
import { Session } from '../sessions/session.entity.js';
import { SessionsService } from '../sessions/sessions.service.js';
import { UnauthenticatedError } from '../sessions/unauthenticated.error.js';
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
  let sessions: Repository<Session>;
  let sessionsService: SessionsService;
  let dataSource: DataSource;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    command = moduleRef.get(AccountsCommand, { strict: false });
    people = moduleRef.get(getRepositoryToken(Person), { strict: false });
    sessions = moduleRef.get(getRepositoryToken(Session), { strict: false });
    sessionsService = moduleRef.get(SessionsService, { strict: false });
    dataSource = moduleRef.get(DataSource, { strict: false });
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
  /** Cria a Pessoa pelo comando e entra `count` vezes, devolvendo os tokens. */
  async function personWithSessions(count: number) {
    const email = uniqueEmail();
    await command.run(['create', email, 'Ana'], prompt);
    const person = await people.findOneByOrFail({ email });
    const tokens: string[] = [];
    for (let index = 0; index < count; index += 1) {
      tokens.push((await sessionsService.login(email, PASSWORD)).token);
    }
    return { email, person, tokens };
  }

  describe('revoke-sessions', () => {
    it('revoga todas as Sessões de uma Pessoa e só as dela', async () => {
      const ana = await personWithSessions(2);
      const bia = await personWithSessions(1);

      const result = await command.run(['revoke-sessions', ana.email], prompt);

      expect(result).toEqual({
        ok: true,
        message: `2 Sessões revogadas para ${ana.email}.`,
      });
      expect(await sessions.countBy({ personId: ana.person.id })).toBe(0);
      expect(await sessions.countBy({ personId: bia.person.id })).toBe(1);
      await expect(
        sessionsService.verify(ana.tokens[0]),
      ).rejects.toBeInstanceOf(UnauthenticatedError);
    });

    it('recusa revogar para um e-mail sem conta', async () => {
      const result = await command.run(
        ['revoke-sessions', uniqueEmail()],
        prompt,
      );

      expect(result).toEqual({
        ok: false,
        message: 'Não existe conta com este e-mail.',
      });
    });
  });

  describe('reset-password', () => {
    const NEW_PASSWORD = 'senha-nova-456';

    it('troca a senha e revoga as Sessões da Pessoa', async () => {
      const ana = await personWithSessions(2);
      const bia = await personWithSessions(1);

      const result = await command.run(['reset-password', ana.email], {
        read: async () => NEW_PASSWORD,
      });

      const updated = await people.findOneByOrFail({ id: ana.person.id });
      expect(result.ok).toBe(true);
      expect(result.message).toContain(ana.email);
      expect(await verify(updated.passwordHash, NEW_PASSWORD)).toBe(true);
      expect(await verify(updated.passwordHash, PASSWORD)).toBe(false);
      expect(await sessions.countBy({ personId: ana.person.id })).toBe(0);
      expect(await sessions.countBy({ personId: bia.person.id })).toBe(1);
    });

    it('recusa redefinir com senha vazia ou e-mail sem conta', async () => {
      const ana = await personWithSessions(1);

      const empty = await command.run(['reset-password', ana.email], {
        read: async () => '',
      });
      const unknown = await command.run(['reset-password', uniqueEmail()], {
        read: async () => NEW_PASSWORD,
      });

      const unchanged = await people.findOneByOrFail({ id: ana.person.id });
      expect(empty).toEqual({
        ok: false,
        message: 'A senha não pode ser vazia.',
      });
      expect(unknown).toEqual({
        ok: false,
        message: 'Não existe conta com este e-mail.',
      });
      expect(unchanged.passwordHash).toBe(ana.person.passwordHash);
      expect(await sessions.countBy({ personId: ana.person.id })).toBe(1);
    });
  });

  describe('purge-expired-sessions', () => {
    it('apaga só as Sessões vencidas', async () => {
      const ana = await personWithSessions(2);
      await dataSource.query(
        `UPDATE sessions SET expires_at = now() - interval '1 minute'
          WHERE person_id = $1 AND id = (SELECT id FROM sessions WHERE person_id = $1 ORDER BY created_at LIMIT 1)`,
        [ana.person.id],
      );

      const result = await command.run(['purge-expired-sessions'], prompt);

      expect(result.ok).toBe(true);
      expect(result.message).toMatch(/vencida/);
      const remaining = await sessions.findBy({ personId: ana.person.id });
      expect(remaining).toHaveLength(1);
      expect(remaining[0].expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });
});
