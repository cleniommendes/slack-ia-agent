import { execFileSync } from 'node:child_process';
import { Client } from 'pg';

const TEST_DATABASE = 'chat_test';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável ${name} ausente: o e2e roda no contêiner chat-api.`,
    );
  }
  return value;
}

/** Cria o chat_test se faltar (volume antigo) e roda as migrações nele. */
async function ensureTestDatabase(adminUrl: string): Promise<void> {
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  try {
    const { rowCount } = await admin.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [TEST_DATABASE],
    );
    if (rowCount === 0) {
      await admin.query(`CREATE DATABASE ${TEST_DATABASE} OWNER chat`);
      await admin.query(
        `REVOKE CONNECT ON DATABASE ${TEST_DATABASE} FROM PUBLIC`,
      );
      await admin.query(`GRANT CONNECT ON DATABASE ${TEST_DATABASE} TO chat`);
    }
  } finally {
    await admin.end();
  }
}

export default async function globalSetup(): Promise<void> {
  const testUrl = requireEnv('TEST_DATABASE_URL');
  await ensureTestDatabase(requireEnv('TEST_DATABASE_ADMIN_URL'));

  execFileSync('pnpm', ['migration:run'], {
    env: { ...process.env, DATABASE_URL: testUrl },
    stdio: 'inherit',
  });
}
