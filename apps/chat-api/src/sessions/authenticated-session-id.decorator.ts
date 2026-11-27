import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from './session.guard.js';

/** O id da Sessão que o `SessionGuard` verificou. */
export const AuthenticatedSessionId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().auth!.sessionId,
);
