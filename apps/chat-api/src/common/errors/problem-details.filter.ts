import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { STATUS_CODES } from 'node:http';
import { DomainError } from './domain.error.js';
import { ERROR_PROBLEMS, type ErrorCode } from './error-code.js';

interface Problem {
  status: number;
  code: ErrorCode;
  detail: string;
}

/** Traduz todo erro em `application/problem+json` (RFC 9457), com `code`. */
@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const problem = this.toProblem(exception);
    if (problem.code === 'internal_error') {
      this.logger.error('Erro inesperado', exception);
    }

    const response = host.switchToHttp().getResponse<Response>();
    response
      .status(problem.status)
      .type('application/problem+json')
      .json({
        type: 'about:blank',
        title: STATUS_CODES[problem.status] ?? 'Error',
        status: problem.status,
        detail: problem.detail,
        code: problem.code,
      });
  }

  private toProblem(exception: unknown): Problem {
    if (exception instanceof DomainError) {
      return {
        status: ERROR_PROBLEMS[exception.code].status,
        code: exception.code,
        detail: exception.message,
      };
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : bodyReaderStatus(exception);

    if (status !== undefined && status >= 400 && status < 500) {
      const code = clientErrorCode(status);
      return { status, code, detail: ERROR_PROBLEMS[code].detail };
    }

    return {
      ...ERROR_PROBLEMS.internal_error,
      code: 'internal_error',
    };
  }
}

function clientErrorCode(status: number): ErrorCode {
  if (status === HttpStatus.BAD_REQUEST) return 'validation_failed';
  if (status === HttpStatus.NOT_FOUND) return 'not_found';
  if (status === HttpStatus.PAYLOAD_TOO_LARGE) return 'payload_too_large';
  return 'request_rejected';
}

/**
 * Erro do leitor do corpo do Express (JSON malformado, corpo grande demais).
 * Só ele tem o status aceito; qualquer outro erro com `status` é inesperado.
 */
function bodyReaderStatus(exception: unknown): number | undefined {
  if (typeof exception !== 'object' || exception === null) return undefined;
  const { status, type, expose } = exception as Record<string, unknown>;
  if (
    typeof status === 'number' &&
    typeof type === 'string' &&
    expose === true
  ) {
    return status;
  }
  return undefined;
}
