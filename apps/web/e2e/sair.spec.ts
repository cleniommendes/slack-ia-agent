import type { Locator, Page } from '@playwright/test';
import { countSessions, expect, signInInNewContext, test } from './fixtures';

const SESSION_COOKIE = 'clenio_session';

/** Aperta Tab até o foco chegar ao alvo (no `next dev`, o indicador do Next também entra na ordem). */
async function tabUntilFocused(page: Page, target: Locator) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await page.keyboard.press('Tab');
    if (
      await target.evaluate((element) => element === document.activeElement)
    ) {
      return;
    }
  }
  throw new Error('O foco não chegou ao alvo com Tab.');
}

function userMenuButton(page: Page) {
  return page.getByRole('button', { name: /menu da conta de/ });
}

async function cookieNames(page: Page) {
  return (await page.context().cookies()).map((cookie) => cookie.name);
}

test.describe('menu do avatar', () => {
  test('abre o menu do avatar pelo teclado e foca o item Sair do Clenio', async ({
    loggedInPage: page,
  }) => {
    await tabUntilFocused(page, userMenuButton(page));
    await expect(userMenuButton(page)).toBeFocused();

    await page.keyboard.press('Enter');

    await expect(
      page.getByRole('menuitem', { name: 'Sair do Clenio' }),
    ).toBeFocused();
  });

  test('abre o menu do avatar com o mouse e fecha com Esc', async ({
    loggedInPage: page,
  }) => {
    await userMenuButton(page).click();
    await expect(page.getByRole('menu')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(userMenuButton(page)).toBeFocused();
  });

  test('mostra o cabeçalho com o nome e um único item', async ({
    loggedInPage: page,
  }) => {
    await userMenuButton(page).click();

    const menu = page.getByRole('menu');
    await expect(menu.getByText('Ana Souza')).toBeVisible();
    await expect(menu.getByRole('menuitem')).toHaveCount(1);
    await expect(menu.getByRole('menuitem')).toHaveText('Sair do Clenio');
  });
});

test.describe('sair', () => {
  test('sai pelo menu: leva a Entrar, apaga o cookie e a Sessão', async ({
    loggedInPage: page,
    person,
  }) => {
    expect(await countSessions(person)).toBe(1);

    await userMenuButton(page).click();
    await page.getByRole('menuitem', { name: 'Sair do Clenio' }).click();

    await expect(page).toHaveURL('http://web:3000/entrar');
    await expect.poll(() => cookieNames(page)).not.toContain(SESSION_COOKIE);
    expect(await countSessions(person)).toBe(0);
  });

  test('sair não derruba a Sessão de outro navegador', async ({
    browser,
    loggedInPage: page,
    person,
  }) => {
    const other = await signInInNewContext(browser, person);

    await userMenuButton(page).click();
    await page.getByRole('menuitem', { name: 'Sair do Clenio' }).click();
    await expect(page).toHaveURL('http://web:3000/entrar');

    await other.page.goto('/');
    await expect(other.page).toHaveURL('http://web:3000/');
    expect(await countSessions(person)).toBe(1);
    await other.context.close();
  });

  test('sai só pelo teclado', async ({ loggedInPage: page }) => {
    await tabUntilFocused(page, userMenuButton(page));
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('http://web:3000/entrar');
  });

  test('leva a outra aba a Entrar na próxima navegação', async ({
    loggedInPage: page,
  }) => {
    const secondTab = await page.context().newPage();
    await secondTab.goto('/');
    await expect(secondTab).toHaveURL('http://web:3000/');

    await userMenuButton(page).click();
    await page.getByRole('menuitem', { name: 'Sair do Clenio' }).click();
    await expect(page).toHaveURL('http://web:3000/entrar');

    await secondTab.goto('/');
    await expect(secondTab).toHaveURL('http://web:3000/entrar');
  });

  test('voltar pelo histórico depois de sair não mostra a Home', async ({
    loggedInPage: page,
  }) => {
    await userMenuButton(page).click();
    await page.getByRole('menuitem', { name: 'Sair do Clenio' }).click();
    await expect(page).toHaveURL('http://web:3000/entrar');

    await page.goBack();

    await expect(page).toHaveURL('http://web:3000/entrar');
    await expect(page.getByText('Nenhuma conversa ainda')).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Seções' })).toHaveCount(
      0,
    );
  });
});

test.describe('cache das telas logadas', () => {
  test('responde as telas logadas com Cache-Control: no-store', async ({
    loggedInPage: page,
  }) => {
    const response = await page.goto('/');

    expect(response!.headers()['cache-control']).toContain('no-store');
  });

  test('recarrega a Home no pageshow com persisted', async ({
    loggedInPage: page,
  }) => {
    await page.evaluate(() => {
      (window as unknown as { marker: number }).marker = 1;
    });
    await page.context().clearCookies();

    await page.evaluate(() =>
      window.dispatchEvent(
        new PageTransitionEvent('pageshow', { persisted: false }),
      ),
    );
    await expect(page).toHaveURL('http://web:3000/');
    expect(
      await page.evaluate(
        () => (window as unknown as { marker?: number }).marker,
      ),
    ).toBe(1);

    await page.evaluate(() =>
      window.dispatchEvent(
        new PageTransitionEvent('pageshow', { persisted: true }),
      ),
    );
    await expect(page).toHaveURL('http://web:3000/entrar');
  });
});
