import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { signInPath } from '@/app/utils/return-path';
import { clearSessionCookie } from '@/app/utils/session-cookie';

/**
 * Apaga o cookie de sessão e leva a Entrar, com o `?para=` quando ele é um caminho do chat. Uma
 * renderização não apaga cookie, então quem recebe 401 redireciona para cá.
 */
export async function GET(request: NextRequest) {
  await clearSessionCookie();
  redirect(signInPath(request.nextUrl.searchParams.get('para')));
}
