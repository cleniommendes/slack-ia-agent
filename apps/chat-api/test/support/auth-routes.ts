import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import type { Env } from '../../src/config/env.schema.js';
import { PeopleService } from '../../src/people/people.service.js';
import { uniqueEmail } from './unique-email.js';

export const TEST_PASSWORD = 'senha-de-teste-123';

export interface TestPerson {
  id: string;
  email: string;
  name: string;
  password: string;
}

/** Cria a Pessoa direto pelo service, com e-mail único, e devolve os dados para entrar. */
export async function createPerson(
  app: INestApplication,
  options: { email?: string; name?: string; password?: string } = {},
): Promise<TestPerson> {
  const email = options.email ?? uniqueEmail();
  const name = options.name ?? 'Ana Souza';
  const password = options.password ?? TEST_PASSWORD;

  const person = await app.get(PeopleService).create({ email, name, password });

  return { id: person.id, email, name, password };
}

/** Entra pela rota e devolve o token. Falha sozinho se a rota não responder 201. */
export async function login(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/v1/sessions')
    .send({ email, password });

  if (response.status !== 201) {
    throw new Error(`Entrar falhou com ${response.status}: ${response.text}`);
  }
  return response.body.token;
}

/** Valor do cabeçalho `Cookie` com o token, como o BFF o repassa. */
export function sessionCookie(app: INestApplication, token: string): string {
  const name = app
    .get<ConfigService<Env, true>>(ConfigService)
    .get('SESSION_COOKIE_NAME', { infer: true });
  return `${name}=${token}`;
}
