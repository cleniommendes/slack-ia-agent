import { HttpStatus } from '@nestjs/common';

/**
 * Status HTTP e `detail` fixo de cada code. É o mapa único de erros da API.
 * Em `request_rejected` o status é só o padrão: vale o do erro original.
 */
export const ERROR_PROBLEMS = {
  validation_failed: {
    status: HttpStatus.BAD_REQUEST,
    detail: 'Os dados enviados são inválidos.',
  },
  not_found: {
    status: HttpStatus.NOT_FOUND,
    detail: 'Recurso não encontrado.',
  },
  payload_too_large: {
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    detail: 'O corpo da requisição é grande demais.',
  },
  request_rejected: {
    status: HttpStatus.BAD_REQUEST,
    detail: 'A requisição não pôde ser atendida.',
  },
  invalid_credentials: {
    status: HttpStatus.UNAUTHORIZED,
    detail: 'E-mail ou senha incorretos.',
  },
  unauthenticated: {
    status: HttpStatus.UNAUTHORIZED,
    detail: 'Sessão inválida ou vencida.',
  },
  email_already_used: {
    status: HttpStatus.CONFLICT,
    detail: 'Já existe uma conta com este e-mail.',
  },
  internal_error: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    detail: 'Erro interno.',
  },
} as const;

export type ErrorCode = keyof typeof ERROR_PROBLEMS;
