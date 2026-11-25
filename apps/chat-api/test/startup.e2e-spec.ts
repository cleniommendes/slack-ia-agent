import { spawnSync } from 'node:child_process';

describe('Subida da API', () => {
  it('a API não sobe sem DATABASE_URL e diz o nome da variável', () => {
    const env = { ...process.env };
    delete env.DATABASE_URL;

    const result = spawnSync('pnpm', ['exec', 'nest', 'start'], {
      env,
      encoding: 'utf8',
      timeout: 120_000,
    });

    expect(result.status).not.toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain('DATABASE_URL');
  }, 150_000);
});
