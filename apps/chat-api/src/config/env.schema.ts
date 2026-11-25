import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
});

export type Env = z.infer<typeof envSchema>;

/** Valida o ambiente bruto e lança com o nome de cada variável inválida. */
export function parseEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const names = [
      ...new Set(result.error.issues.map((issue) => String(issue.path[0]))),
    ];
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
