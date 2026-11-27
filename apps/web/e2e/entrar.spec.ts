import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const SESSION_COOKIE = 'clenio_session';
const DAY_SECONDS = 24 * 60 * 60;

test.describe('tela Entrar', () => {
  test('entra com e-mail e senha e chega à Home', async ({ page, person }) => {
    await page.goto('/entrar');
    await page.getByLabel('E-mail').fill(person.email);
    await page.getByLabel('Senha').fill(person.password);

    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForURL((url) => url.pathname === '/');
    await expect(page.getByText('Clenio', { exact: true })).toBeVisible();
  });

  test('grava o cookie de sessão com os atributos do LLD', async ({
    context,
    loggedInPage,
  }) => {
    const cookies = await context.cookies();
    const cookie = cookies.find((item) => item.name === SESSION_COOKIE);

    expect(cookie).toBeDefined();
    expect(cookie).toMatchObject({
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      secure: false,
    });
    expect(cookie!.value.length).toBeGreaterThan(30);
    const lifetime = cookie!.expires - Date.now() / 1000;
    expect(lifetime).toBeGreaterThan(399 * DAY_SECONDS);
    expect(lifetime).toBeLessThanOrEqual(400 * DAY_SECONDS);
    expect(loggedInPage.url()).toMatch(/\/$/);
  });

  test('começa com o foco no e-mail', async ({ page }) => {
    await page.goto('/entrar');

    await expect(page.getByLabel('E-mail')).toBeFocused();
  });

  test('bloqueia o segundo envio e mostra o botão carregando', async ({
    page,
    person,
  }) => {
    let submissions = 0;
    await page.route('**/entrar', async (route) => {
      if (route.request().method() === 'POST') {
        submissions += 1;
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      await route.continue();
    });
    await page.goto('/entrar');
    await page.getByLabel('E-mail').fill(person.email);
    await page.getByLabel('Senha').fill(person.password);
    const button = page.getByRole('button', { name: 'Entrar' });

    await button.click();
    await page.getByLabel('Senha').press('Enter');

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await page.waitForURL((url) => url.pathname === '/');
    expect(submissions).toBe(1);
  });

  test('mostra a mensagem, limpa a senha, foca a senha e mantém o e-mail com credenciais incorretas', async ({
    page,
    person,
  }) => {
    await page.goto('/entrar');
    await page.getByLabel('E-mail').fill(person.email);
    await page.getByLabel('Senha').fill('senha-errada');

    await page.getByRole('button', { name: 'Entrar' }).click();

    const message = page.getByText(
      'E-mail ou senha incorretos. Confira os dados e tente de novo.',
    );
    const password = page.getByLabel('Senha');
    await expect(message).toBeVisible();
    await expect(password).toHaveValue('');
    await expect(password).toBeFocused();
    await expect(page.getByLabel('E-mail')).toHaveValue(person.email);
    const passwordBox = (await password.boundingBox())!;
    const messageBox = (await message.boundingBox())!;
    expect(messageBox.y).toBeGreaterThan(
      passwordBox.y + passwordBox.height - 1,
    );
  });
  test.describe('erros de preenchimento', () => {
    const EMAIL_MESSAGE = 'Informe um e-mail válido, como nome@empresa.com.';
    const PASSWORD_MESSAGE = 'Informe sua senha.';

    async function countLoginPosts(page: Page) {
      const counter = { posts: 0 };
      await page.route('**/entrar', async (route) => {
        if (route.request().method() === 'POST') counter.posts += 1;
        await route.continue();
      });
      return counter;
    }

    test('mostra a mensagem do e-mail vazio e do e-mail fora do formato sem enviar', async ({
      page,
    }) => {
      const counter = await countLoginPosts(page);
      await page.goto('/entrar');
      await page.getByLabel('Senha').fill('qualquer');

      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page.getByText(EMAIL_MESSAGE)).toBeVisible();

      await page.getByLabel('E-mail').fill('ana@');
      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page.getByText(EMAIL_MESSAGE)).toBeVisible();
      expect(counter.posts).toBe(0);
    });

    test('mostra a mensagem da senha vazia sem enviar', async ({
      page,
      person,
    }) => {
      const counter = await countLoginPosts(page);
      await page.goto('/entrar');
      await page.getByLabel('E-mail').fill(person.email);

      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page.getByText(PASSWORD_MESSAGE)).toBeVisible();
      await expect(page.getByText(EMAIL_MESSAGE)).toHaveCount(0);
      expect(counter.posts).toBe(0);
    });

    test('mostra as duas mensagens juntas', async ({ page }) => {
      await page.goto('/entrar');

      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page.getByText(EMAIL_MESSAGE)).toBeVisible();
      await expect(page.getByText(PASSWORD_MESSAGE)).toBeVisible();
    });

    test('valida também no servidor, sem JavaScript', async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto('http://web:3000/entrar');

      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page.getByText(EMAIL_MESSAGE)).toBeVisible();
      await expect(page.getByText(PASSWORD_MESSAGE)).toBeVisible();
      expect(new URL(page.url()).pathname).toBe('/entrar');
      await context.close();
    });

    test('aceita o e-mail de teste com domínio .local', async ({
      page,
      person,
    }) => {
      await page.goto('/entrar');
      await page.getByLabel('E-mail').fill(person.email);
      await page.getByLabel('Senha').fill(person.password);

      await page.getByRole('button', { name: 'Entrar' }).click();

      await page.waitForURL((url) => url.pathname === '/');
    });

    test('foca o primeiro campo inválido', async ({ page, person }) => {
      await page.goto('/entrar');
      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page.getByLabel('E-mail')).toBeFocused();

      await page.getByLabel('E-mail').fill(person.email);
      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page.getByLabel('Senha')).toBeFocused();
    });

    test('liga o campo com erro à mensagem por aria-invalid e aria-describedby', async ({
      page,
      person,
    }) => {
      await page.goto('/entrar');
      await page.getByLabel('E-mail').fill(person.email);

      await page.getByRole('button', { name: 'Entrar' }).click();

      const password = page.getByLabel('Senha');
      const email = page.getByLabel('E-mail');
      await expect(password).toHaveAttribute('aria-invalid', 'true');
      await expect(password).toHaveAttribute(
        'aria-describedby',
        'password-error',
      );
      await expect(password).toHaveAccessibleDescription(PASSWORD_MESSAGE);
      await expect(email).not.toHaveAttribute('aria-invalid', /.*/);
      await expect(email).not.toHaveAttribute('aria-describedby', /.*/);
    });
  });
});
