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
});
