export type ErrorCode =
  | 'validation_failed'
  | 'not_found'
  | 'payload_too_large'
  | 'request_rejected'
  | 'internal_error';

/**
 * Status HTTP de cada code. `request_rejected` guarda o status que veio do erro
 * original, e o valor daqui é só o padrão.
 */
export const ERROR_STATUS: Record<ErrorCode, number> = {
  validation_failed: 400,
  not_found: 404,
  payload_too_large: 413,
  request_rejected: 400,
  internal_error: 500,
};

/** Texto fixo do `detail` de cada code, para erro que não é de domínio. */
export const ERROR_DETAIL: Record<ErrorCode, string> = {
  validation_failed: 'Os dados enviados são inválidos.',
  not_found: 'Recurso não encontrado.',
  payload_too_large: 'O corpo da requisição é grande demais.',
  request_rejected: 'A requisição não pôde ser atendida.',
  internal_error: 'Erro interno.',
};
