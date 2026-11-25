import { randomUUID } from 'node:crypto';

/** E-mail único por chamada, para os testes não colidirem. */
export function uniqueEmail(prefix = 'pessoa'): string {
  return `${prefix}-${randomUUID()}@teste.local`.toLowerCase();
}
