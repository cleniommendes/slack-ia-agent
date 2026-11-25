import type { INestApplication, Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module.js';
import { configureApp } from '../../src/app.setup.js';

export interface TestAppOptions {
  /** Controllers extras, para testes da própria base (como uma rota que falha). */
  controllers?: Type[];
}

/** Sobe a mesma aplicação da API, mais os controllers extras do teste. */
export async function createTestApp(
  options: TestAppOptions = {},
): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
    controllers: options.controllers ?? [],
  }).compile();

  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return app;
}
