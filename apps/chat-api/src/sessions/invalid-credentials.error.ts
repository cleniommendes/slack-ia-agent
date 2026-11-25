import { DomainError } from '../common/errors/domain.error.js';
import { ERROR_PROBLEMS } from '../common/errors/error-code.js';

export class InvalidCredentialsError extends DomainError {
  readonly code = 'invalid_credentials';

  constructor() {
    super(ERROR_PROBLEMS.invalid_credentials.detail);
  }
}
