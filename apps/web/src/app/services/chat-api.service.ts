import { getEnv } from '@/app/config/env';

export interface PersonView {
  id: string;
  name: string;
  email: string;
}

/** Erro devolvido pela API do chat (`problem+json`), com o status e o `code` estável. */
export class ChatApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(`A API do chat respondeu ${status} (${code}).`);
  }
}

// O único lugar da web que chama a API do chat (regra do ESLint).
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getEnv().CHAT_API_URL}/v1${path}`, {
    ...init,
    cache: 'no-store',
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new ChatApiError(response.status, problem?.code ?? 'unknown');
  }
  return response.json() as Promise<T>;
}

/** Entra com e-mail e senha: devolve o token e a Pessoa. */
export function createSession(
  email: string,
  password: string,
): Promise<{ token: string; person: PersonView }> {
  return request('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

/** A Pessoa da Sessão do token, repassado no cabeçalho `Cookie`, como a API o lê. */
export function getCurrentSession(
  token: string,
): Promise<{ person: PersonView }> {
  const cookie = `${getEnv().SESSION_COOKIE_NAME}=${token}`;
  return request('/sessions/current', { headers: { Cookie: cookie } });
}
