import { expect, test } from './fixtures';

const SESSION_COOKIE = 'clenio_session';

test.describe('telas logadas', () => {
  test('leva a Entrar sem cookie', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/entrar$/);
  });

  test('leva a Entrar e apaga o cookie quando a API não reconhece a Sessão', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: SESSION_COOKIE,
        value: 'token-que-a-api-nao-conhece',
        url: 'http://web:3000',
      },
    ]);

    await page.goto('/');

    await expect(page).toHaveURL(/\/entrar$/);
    const names = (await context.cookies()).map((cookie) => cookie.name);
    expect(names).not.toContain(SESSION_COOKIE);
  });
});
