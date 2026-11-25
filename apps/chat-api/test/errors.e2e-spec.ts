import { Controller, Get, Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './support/create-test-app.js';

const INTERNAL_DETAIL = 'senha do banco vazou na conexão 10.0.0.7';

@Controller('teste-erro')
class FailingController {
  @Get()
  fail(): never {
    throw new Error(INTERNAL_DETAIL);
  }
}

describe('Erros da API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp({ controllers: [FailingController] });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('responde 404 em problem+json com o code not_found numa rota inexistente', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/rota-inexistente',
    );

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    );
    expect(response.body).toMatchObject({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      code: 'not_found',
    });
    expect(response.body).not.toHaveProperty('instance');
  });

  it('responde 500 sem a mensagem interna nem stack trace e registra o erro em log', async () => {
    const errorLog = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    const response = await request(app.getHttpServer()).get('/v1/teste-erro');

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    );
    expect(response.body).toMatchObject({
      status: 500,
      code: 'internal_error',
    });
    expect(JSON.stringify(response.body)).not.toContain(INTERNAL_DETAIL);
    expect(JSON.stringify(response.body)).not.toContain('at ');
    expect(errorLog).toHaveBeenCalled();
  });
});
