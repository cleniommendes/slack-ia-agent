import type { ErrorCode } from './error-code.js';

/**
 * Erro de uma regra de negócio violada. Não sabe o status HTTP: quem traduz é o
 * filter global. A mensagem vai para o `detail` da resposta, então não traz
 * detalhes internos.
 */
export abstract class DomainError extends Error {
  abstract readonly code: ErrorCode;
}
