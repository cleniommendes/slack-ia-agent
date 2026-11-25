import type { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createTestApp } from './support/create-test-app.js';

describe('Banco de testes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('a aplicação de teste usa o banco chat_test com as migrações rodadas', async () => {
    const dataSource = app.get(DataSource);

    const [row] = await dataSource.query(
      `SELECT current_database() AS database, to_regclass('public.migrations') AS migrations`,
    );

    expect(row.database).toBe('chat_test');
    expect(row.migrations).toBe('migrations');
  });
});
