import { randomUUID } from 'node:crypto';
import {
  test as base,
  expect,
  type Browser,
  type BrowserContext,
  type Page,
} from '@playwright/test';
import { Client } from 'pg';

// O contêiner e2e só roda no ambiente local, então o banco fica escrito aqui (host = nome do serviço).
const DATABASE_URL = 'postgres://chat:chat@postgres:5432/chat';

const PASSWORD = 'senha-e2e-123';
// Argon2id de PASSWORD, gerado uma vez com @node-rs/argon2.
const PASSWORD_HASH =
  '$argon2id$v=19$m=19456,t=2,p=1$51XQTQ/CQ898WedQJKpq8Q$jDJT6SCzHNSmMRgL7qMwkqQ9XRIChFf+cvyeymUKTpo';

export interface TestPerson {
  email: string;
  password: string;
  name: string;
}

async function createPerson(): Promise<TestPerson> {
  const person = {
    email: `e2e-${randomUUID()}@teste.local`,
    password: PASSWORD,
    name: 'Ana Souza',
  };
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    await client.query(
      'INSERT INTO people (id, email, name, password_hash) VALUES ($1, $2, $3, $4)',
      [randomUUID(), person.email, person.name, PASSWORD_HASH],
    );
  } finally {
    await client.end();
  }
  return person;
}

/** Apaga as Sessões da Pessoa direto no banco, como o comando `revoke-sessions` da API. */
export async function revokeSessions(person: TestPerson) {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    await client.query(
      'DELETE FROM sessions USING people WHERE people.id = sessions.person_id AND people.email = $1',
      [person.email],
    );
  } finally {
    await client.end();
  }
}

/** Quantas Sessões a Pessoa tem no banco `chat`. */
export async function countSessions(person: TestPerson): Promise<number> {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    const result = await client.query(
      'SELECT count(*)::int AS total FROM sessions JOIN people ON people.id = sessions.person_id WHERE people.email = $1',
      [person.email],
    );
    return result.rows[0].total;
  } finally {
    await client.end();
  }
}

/** Um segundo navegador: um contexto novo, logado pelo formulário como a Pessoa. */
export async function signInInNewContext(
  browser: Browser,
  person: TestPerson,
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ baseURL: 'http://web:3000' });
  const page = await context.newPage();
  await signInThroughForm(page, person);
  return { context, page };
}

/** Entra pelo formulário da tela Entrar. É o único lugar que faz isso. */
async function signInThroughForm(page: Page, person: TestPerson) {
  await page.goto('/entrar');
  await page.getByLabel('E-mail').fill(person.email);
  await page.getByLabel('Senha').fill(person.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL((url) => url.pathname === '/');
}

export const test = base.extend<{ person: TestPerson; loggedInPage: Page }>({
  person: async ({}, use) => {
    await use(await createPerson());
  },
  loggedInPage: async ({ page, person }, use) => {
    await signInThroughForm(page, person);
    await use(page);
  },
});

export { expect };
