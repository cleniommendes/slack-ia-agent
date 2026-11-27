import type { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { createTestApp } from './support/create-test-app.js';
import { uniqueEmail } from './support/unique-email.js';

describe('Tabela people', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await createTestApp();
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  function insertPerson(email: string) {
    return dataSource.query(
      `INSERT INTO people (id, email, name, password_hash) VALUES ($1, $2, 'Ana', 'hash')`,
      [randomUUID(), email],
    );
  }

  it('o banco recusa e-mail repetido', async () => {
    const email = uniqueEmail();
    await insertPerson(email);

    const insertion = insertPerson(email);

    await expect(insertion).rejects.toThrow(/unique|duplicate/i);
  });

  it('o banco recusa e-mail com maiúsculas', async () => {
    const insertion = insertPerson(uniqueEmail().toUpperCase());

    await expect(insertion).rejects.toThrow(/check/i);
  });

  it('o banco recusa e-mail com espaços nas pontas', async () => {
    const insertion = insertPerson(` ${uniqueEmail()} `);

    await expect(insertion).rejects.toThrow(/check/i);
  });
});
