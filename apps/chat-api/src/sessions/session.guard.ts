import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { parseCookie } from 'cookie';
import type { Env } from '../config/env.schema.js';
import type { Person } from '../people/person.entity.js';
import { SessionsService } from './sessions.service.js';
import { UnauthenticatedError } from './unauthenticated.error.js';

export type AuthenticatedRequest = Request & { auth?: { person: Person } };

/** Verifica a Sessão do cookie. Reaproveitado pelas rotas logadas e, na F03, pelo WebSocket. */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly sessions: SessionsService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const cookieName = this.config.get('SESSION_COOKIE_NAME', { infer: true });
    const token = parseCookie(request.headers.cookie ?? '')[cookieName];

    if (!token) {
      throw new UnauthenticatedError();
    }

    request.auth = { person: await this.sessions.verify(token) };
    return true;
  }
}
