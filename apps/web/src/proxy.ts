import { NextResponse, type NextRequest } from 'next/server';
import { getEnv } from '@/app/config/env';
import { REQUEST_PATH_HEADER, signInPath } from '@/app/utils/return-path';

/** Sem cookie de sessão, qualquer tela logada vai para Entrar. Quem valida a Sessão é a API. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const requestedPath = pathname + search;

  if (!request.cookies.has(getEnv().SESSION_COOKIE_NAME)) {
    return NextResponse.redirect(
      new URL(signInPath(requestedPath), request.url),
    );
  }

  // O layout logado não tem a URL: o caminho segue num cabeçalho, sempre sobrescrito aqui.
  const headers = new Headers(request.headers);
  headers.set(REQUEST_PATH_HEADER, requestedPath);
  const response = NextResponse.next({ request: { headers } });
  // As telas logadas não ficam no cache do navegador: voltar pelo histórico depois de sair não as mostra.
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const config = {
  matcher: [
    '/((?!entrar|api/sessao/encerrar|_next/static|_next/image|favicon.ico).*)',
  ],
};
