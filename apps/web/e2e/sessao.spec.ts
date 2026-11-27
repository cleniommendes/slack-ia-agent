import { expect, revokeSessions, test } from './fixtures';

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
  test('leva quem já está logada de Entrar para a Home', async ({
    loggedInPage,
  }) => {
    await loggedInPage.goto('/entrar');

    await expect(loggedInPage).toHaveURL('http://web:3000/');
  });

  test('mostra o formulário e apaga o cookie quando a API não reconhece a Sessão', async ({
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

    await page.goto('/entrar');

    await expect(page).toHaveURL('http://web:3000/entrar');
    await expect(page.getByLabel('E-mail')).toBeVisible();
    // O formulário já está no HTML inicial: o cookie some quando a verificação termina.
    await expect
      .poll(async () => (await context.cookies()).map((cookie) => cookie.name))
      .not.toContain(SESSION_COOKIE);
  });

  test('mantém o para ao apagar o cookie de uma Sessão desconhecida', async ({
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

    await page.goto('/entrar?para=%2F%3Ffoo%3Dbar');
    // A URL é a mesma antes e depois do redirecionamento: espera o cookie sumir para conferi-la.
    await expect
      .poll(async () => (await context.cookies()).map((cookie) => cookie.name))
      .not.toContain(SESSION_COOKIE);

    await expect(page).toHaveURL('http://web:3000/entrar?para=%2F%3Ffoo%3Dbar');
    await expect(page.getByLabel('E-mail')).toBeVisible();
  });
  test('continua logada numa segunda aba', async ({ loggedInPage }) => {
    const secondTab = await loggedInPage.context().newPage();

    await secondTab.goto('/');

    await expect(secondTab).toHaveURL('http://web:3000/');
    await expect(secondTab.getByText('Clenio', { exact: true })).toBeVisible();
  });

  test('continua logada num contexto novo com os cookies guardados', async ({
    browser,
    loggedInPage,
  }) => {
    const state = await loggedInPage.context().storageState();
    const cookie = state.cookies.find((item) => item.name === SESSION_COOKIE);
    // Um cookie com validade sobrevive a fechar o navegador; sem ela, seria só de sessão.
    expect(cookie!.expires).toBeGreaterThan(Date.now() / 1000);

    const reopened = await browser.newContext({ storageState: state });
    const page = await reopened.newPage();
    await page.goto('http://web:3000/');

    await expect(page).toHaveURL('http://web:3000/');
    await expect(page.getByText('Clenio', { exact: true })).toBeVisible();
    await reopened.close();
  });

  test('leva a Entrar na próxima navegação depois de a Sessão ser revogada', async ({
    loggedInPage,
    person,
  }) => {
    await revokeSessions(person);

    await loggedInPage.goto('/');

    await expect(loggedInPage).toHaveURL('http://web:3000/entrar');
    await expect
      .poll(async () =>
        (await loggedInPage.context().cookies()).map((cookie) => cookie.name),
      )
      .not.toContain(SESSION_COOKIE);
  });
});
