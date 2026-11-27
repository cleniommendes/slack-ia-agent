import { DomainError } from '../common/errors/domain.error.js';
import { ERROR_PROBLEMS } from '../common/errors/error-code.js';

export class EmailAlreadyUsedError extends DomainError {
  readonly code = 'email_already_used';

  constructor() {
    super(ERROR_PROBLEMS.email_already_used.detail);
  }
}
