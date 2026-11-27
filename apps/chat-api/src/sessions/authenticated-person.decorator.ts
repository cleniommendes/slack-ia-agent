import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from './session.guard.js';

/** A Pessoa que o `SessionGuard` verificou. */
export const AuthenticatedPerson = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().auth!.person,
);
