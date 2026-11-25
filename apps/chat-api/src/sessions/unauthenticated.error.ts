import { DomainError } from '../common/errors/domain.error.js';
import { ERROR_PROBLEMS } from '../common/errors/error-code.js';

export class UnauthenticatedError extends DomainError {
  readonly code = 'unauthenticated';

  constructor() {
    super(ERROR_PROBLEMS.unauthenticated.detail);
  }
}
