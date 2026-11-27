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

/** A API do chat não respondeu: falha de rede ou tempo esgotado. */
export class ChatApiUnavailableError extends Error {
  constructor() {
    super('A API do chat não respondeu.');
  }
}

/** Tempo máximo de uma chamada à API do chat (LLD, "Valores e configuração"). */
export const CHAT_API_TIMEOUT_MS = 10_000;

// O único lugar da web que chama a API do chat (regra do ESLint).
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getEnv().CHAT_API_URL}/v1${path}`, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(CHAT_API_TIMEOUT_MS),
    });
  } catch {
    throw new ChatApiUnavailableError();
  }

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
