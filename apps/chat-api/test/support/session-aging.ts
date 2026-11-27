import type { INestApplication } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { DataSource } from 'typeorm';

export interface SessionRow {
  id: string;
  expires_at: Date;
  last_used_at: Date;
  updated_at: Date;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** A linha da Sessão do token, ou `null` quando ela não existe. */
export async function findSession(
  app: INestApplication,
  token: string,
): Promise<SessionRow | null> {
  const rows: SessionRow[] = await app
    .get(DataSource)
    .query(
      `SELECT id, expires_at, last_used_at, updated_at FROM sessions WHERE token_hash = $1`,
      [hashToken(token)],
    );
  return rows[0] ?? null;
}

/** Envelhece a Sessão do token direto no banco, sem relógio falso. */
export async function ageSession(
  app: INestApplication,
  token: string,
  dates: { lastUsedAt?: Date; expiresAt?: Date },
): Promise<void> {
  await app.get(DataSource).query(
    `UPDATE sessions
         SET last_used_at = COALESCE($2, last_used_at),
             expires_at = COALESCE($3, expires_at)
       WHERE token_hash = $1`,
    [hashToken(token), dates.lastUsedAt ?? null, dates.expiresAt ?? null],
  );
}
