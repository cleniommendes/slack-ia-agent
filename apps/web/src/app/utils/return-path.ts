/** Cabeçalho que o proxy preenche com o caminho pedido, para o layout logado saber para onde voltar. */
export const REQUEST_PATH_HEADER = 'x-clenio-path';

export const END_SESSION_PATH = '/api/sessao/encerrar';

/**
 * Devolve o caminho de volta quando ele é do próprio chat: relativo, começa com `/` e não com
 * `//`. Também recusa `\` (o navegador lê `/\x` como `//x`) e caracteres de controle.
 */
export function safeReturnPath(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('/') || value.startsWith('//')) return null;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return null;
  return value;
}

/** A Home é o destino padrão, então não precisa de `para`. */
function withReturnPath(base: string, path: unknown): string {
  const safe = safeReturnPath(path);
  if (!safe || safe === '/') return base;
  return `${base}?para=${encodeURIComponent(safe)}`;
}

/** O endereço de Entrar, com o caminho de volta quando há um válido. */
export function signInPath(path: unknown): string {
  return withReturnPath('/entrar', path);
}

/** A rota que apaga o cookie e volta a Entrar, com o caminho de volta quando há um válido. */
export function endSessionPath(path: unknown): string {
  return withReturnPath(END_SESSION_PATH, path);
}
