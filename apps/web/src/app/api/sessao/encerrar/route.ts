import { redirect } from 'next/navigation';
import { clearSessionCookie } from '@/app/utils/session-cookie';

/**
 * Apaga o cookie de sessão e leva a Entrar. Uma renderização não apaga cookie, então o layout
 * que recebe 401 redireciona para cá.
 */
export async function GET() {
  await clearSessionCookie();
  redirect('/entrar');
}
