import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  SESSION_COOKIE_NAME: z.string().min(1),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(30),
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

/** Lê o ambiente do processo. Só `src/config/` toca em `process.env`. */
export function loadEnv(): Env {
  return parseEnv(process.env);
}
