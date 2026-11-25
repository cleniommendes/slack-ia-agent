import type { INestApplication } from '@nestjs/common';
import { createHash } from 'node:crypto';
import request from 'supertest';
import { DataSource } from 'typeorm';
import {
  createPerson,
  login,
  sessionCookie,
  TEST_PASSWORD,
} from './support/auth-routes.js';
import { createTestApp } from './support/create-test-app.js';
import { uniqueEmail } from './support/unique-email.js';

const INVALID_CREDENTIALS = {
  type: 'about:blank',
  title: 'Unauthorized',
  status: 401,
  detail: 'E-mail ou senha incorretos.',
  code: 'invalid_credentials',
};

const UNAUTHENTICATED = {
  type: 'about:blank',
  title: 'Unauthorized',
  status: 401,
  detail: 'Sessão inválida ou vencida.',
  code: 'unauthenticated',
};

describe('Sessões', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/sessions', () => {
    it('responde 201 com o token e grava só o hash da Sessão', async () => {
      const person = await createPerson(app);

      const response = await request(app.getHttpServer())
        .post('/v1/sessions')
        .send({ email: person.email, password: person.password });

      const token: string = response.body.token;
      const hash = createHash('sha256').update(token).digest('hex');
      const rows = await app
        .get(DataSource)
        .query(
          `SELECT token_hash FROM sessions WHERE person_id = $1 ORDER BY created_at`,
          [person.id],
        );
      expect(response.status).toBe(201);
      expect(response.body.person).toEqual({
        id: person.id,
        name: person.name,
        email: person.email,
      });
      expect(rows).toEqual([{ token_hash: hash }]);
      expect(rows[0].token_hash).not.toBe(token);
    });

    it('aceita o e-mail com maiúsculas e espaços nas pontas', async () => {
      const person = await createPerson(app);

      const response = await request(app.getHttpServer())
        .post('/v1/sessions')
        .send({
          email: `  ${person.email.toUpperCase()}  `,
          password: person.password,
        });

      expect(response.status).toBe(201);
      expect(response.body.person.id).toBe(person.id);
    });

    it('responde 401 invalid_credentials para e-mail sem conta', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/sessions')
        .send({ email: uniqueEmail(), password: TEST_PASSWORD });

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toContain(
        'application/problem+json',
      );
      expect(response.body).toEqual(INVALID_CREDENTIALS);
    });

    it('responde 401 invalid_credentials com o mesmo corpo para senha errada', async () => {
      const person = await createPerson(app);

      const response = await request(app.getHttpServer())
        .post('/v1/sessions')
        .send({ email: person.email, password: 'outra-senha' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(INVALID_CREDENTIALS);
    });

    it.each([
      ['e-mail fora do formato', { email: 'nao-e-email', password: 'x' }],
      [
        'e-mail com 255 caracteres',
        { email: `${'a'.repeat(243)}@teste.local`, password: 'x' },
      ],
      ['senha vazia', { email: 'ana@teste.local', password: '' }],
      [
        'senha com 257 caracteres',
        { email: 'ana@teste.local', password: 'x'.repeat(257) },
      ],
    ])('responde 400 validation_failed para %s', async (_name, body) => {
      const response = await request(app.getHttpServer())
        .post('/v1/sessions')
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('validation_failed');
    });
  });

  describe('GET /v1/sessions/current', () => {
    it('responde 200 com a Pessoa da Sessão', async () => {
      const person = await createPerson(app);
      const token = await login(app, person.email, person.password);

      const response = await request(app.getHttpServer())
        .get('/v1/sessions/current')
        .set('Cookie', sessionCookie(app, token));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        person: { id: person.id, name: person.name, email: person.email },
      });
    });

    it('responde 401 unauthenticated sem cookie', async () => {
      const response = await request(app.getHttpServer()).get(
        '/v1/sessions/current',
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual(UNAUTHENTICATED);
    });

    it('responde 401 unauthenticated com token desconhecido', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/sessions/current')
        .set('Cookie', sessionCookie(app, 'token-que-nao-existe'));

      expect(response.status).toBe(401);
      expect(response.body).toEqual(UNAUTHENTICATED);
    });
  });
});
