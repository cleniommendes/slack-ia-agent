import { cookies } from 'next/headers';
import { getEnv } from '@/app/config/env';

// O cookie dura mais que a Sessão de propósito: quem decide é a API (LLD, "Segurança").
const SESSION_COOKIE_MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

function baseOptions() {
  const { SESSION_COOKIE_DOMAIN, SESSION_COOKIE_SECURE } = getEnv();
  return {
    httpOnly: true,
    secure: SESSION_COOKIE_SECURE,
    sameSite: 'lax' as const,
    path: '/',
    ...(SESSION_COOKIE_DOMAIN && { domain: SESSION_COOKIE_DOMAIN }),
  };
}

export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(getEnv().SESSION_COOKIE_NAME, token, {
    ...baseOptions(),
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
}

/** Só vale num Server Action ou num Route Handler. */
export async function clearSessionCookie(): Promise<void> {
  (await cookies()).set(getEnv().SESSION_COOKIE_NAME, '', {
    ...baseOptions(),
    maxAge: 0,
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(getEnv().SESSION_COOKIE_NAME)?.value;
}
