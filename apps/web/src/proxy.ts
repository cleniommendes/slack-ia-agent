import { NextResponse, type NextRequest } from 'next/server';
import { getEnv } from '@/app/config/env';

/** Sem cookie de sessão, qualquer tela logada vai para Entrar. Quem valida a Sessão é a API. */
export function proxy(request: NextRequest) {
  if (!request.cookies.has(getEnv().SESSION_COOKIE_NAME)) {
    return NextResponse.redirect(new URL('/entrar', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!entrar|api/sessao/encerrar|_next/static|_next/image|favicon.ico).*)',
  ],
};
