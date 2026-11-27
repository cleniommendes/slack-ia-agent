import { expect, test, type TestPerson } from './fixtures';
import type { Page } from '@playwright/test';

async function signInOnPage(page: Page, person: TestPerson) {
  await page.getByLabel('E-mail').fill(person.email);
  await page.getByLabel('Senha').fill(person.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

function currentPath(page: Page) {
  const url = new URL(page.url());
  return { origin: url.origin, path: url.pathname + url.search };
}

test.describe('voltar para onde ia', () => {
  test('leva a Entrar com o caminho pedido e a busca, sem cookie', async ({
    page,
  }) => {
    await page.goto('/conversas/abc?x=1');

    await expect(page).toHaveURL(
      'http://web:3000/entrar?para=%2Fconversas%2Fabc%3Fx%3D1',
    );
  });

  test('leva a Entrar com o caminho pedido quando a API responde 401', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'clenio_session',
        value: 'token-que-a-api-nao-conhece',
        url: 'http://web:3000',
      },
    ]);

    await page.goto('/?foo=bar');

    await expect(page).toHaveURL('http://web:3000/entrar?para=%2F%3Ffoo%3Dbar');
    const names = (await context.cookies()).map((cookie) => cookie.name);
    expect(names).not.toContain('clenio_session');
  });

  test('não leva o para quando o endereço pedido é a Home', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page).toHaveURL('http://web:3000/entrar');
  });

  test('cai no endereço pedido depois de entrar', async ({ page, person }) => {
    await page.goto('/?foo=bar');
    await expect(page).toHaveURL(/\/entrar\?para=/);

    await signInOnPage(page, person);

    await expect(page).toHaveURL('http://web:3000/?foo=bar');
    await expect(page.getByText('Clenio', { exact: true })).toBeVisible();
  });

  test('cai num caminho profundo pedido por link, com a busca', async ({
    page,
    person,
  }) => {
    await page.goto('/conversas/abc?x=1');

    await signInOnPage(page, person);

    await page.waitForURL((url) => url.pathname === '/conversas/abc');
    expect(currentPath(page).path).toBe('/conversas/abc?x=1');
  });

  test('cai na Home sem para', async ({ page, person }) => {
    await page.goto('/entrar');

    await signInOnPage(page, person);

    await expect(page).toHaveURL('http://web:3000/');
  });

  for (const outside of [
    '//outro-site',
    'https://outro-site',
    '/%5Coutro-site',
  ]) {
    test(`cai na Home com o para ${outside}, que não é do chat`, async ({
      page,
      person,
    }) => {
      await page.goto(`/entrar?para=${outside}`);

      await signInOnPage(page, person);

      await expect(page).toHaveURL('http://web:3000/');
    });
  }

  test('valida o para também no Server Action', async ({ page, person }) => {
    await page.goto('/entrar?para=%2F%3Ffoo%3Dbar');
    await page.getByLabel('E-mail').fill(person.email);
    await page.getByLabel('Senha').fill(person.password);
    await page.waitForLoadState('networkidle');
    // O campo escondido vem do navegador: aqui ele é trocado depois de a tela assentar.
    await page.evaluate(() => {
      const field =
        document.querySelector<HTMLInputElement>('input[name="para"]');
      field!.value = '//outro-site';
    });

    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL('http://web:3000/');
  });
});
