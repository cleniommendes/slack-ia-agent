import { z } from 'zod';

const envSchema = z.object({
  CHAT_API_URL: z.url(),
  SESSION_COOKIE_NAME: z.string().min(1),
  // Vazio no local: o cookie fica só no host, sem o atributo Domain.
  SESSION_COOKIE_DOMAIN: z.string().default(''),
  SESSION_COOKIE_SECURE: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true'),
});

export type Env = z.infer<typeof envSchema>;

/** Valida o ambiente bruto e lança com o nome de cada variável inválida. */
export function parseEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const names = Object.keys(z.flattenError(result.error).fieldErrors);
    throw new Error(
      `Configuração inválida. Variáveis ausentes ou inválidas: ${names.join(', ')}`,
    );
  }
  return result.data;
}

let cached: Env | undefined;

/** Lê o ambiente do processo uma vez. Só este arquivo toca em `process.env`. */
export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}
