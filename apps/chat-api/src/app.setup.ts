import type { INestApplication } from '@nestjs/common';

export const API_PREFIX = 'v1';

/** Configuração da aplicação usada pelo `main.ts` e pelos testes. */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix(API_PREFIX);
}
