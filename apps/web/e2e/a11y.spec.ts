import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function violationsOf(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  return results.violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => node.target),
  }));
}

test.describe('acessibilidade e teclado', () => {
  test('a tela Entrar não tem violações do axe', async ({ page }) => {
    await page.goto('/entrar');

    expect(await violationsOf(page)).toEqual([]);
  });

  test('a tela Entrar com erros de validação não tem violações do axe', async ({
    page,
  }) => {
    await page.goto('/entrar');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Informe sua senha.')).toBeVisible();

    expect(await violationsOf(page)).toEqual([]);
  });

  test('a Home não tem violações do axe', async ({ loggedInPage }) => {
    await expect(
      loggedInPage.getByText('Clenio', { exact: true }),
    ).toBeVisible();

    expect(await violationsOf(loggedInPage)).toEqual([]);
  });

  test('percorre E-mail, Senha e o botão com Tab e envia com Enter', async ({
    page,
    person,
  }) => {
    await page.goto('/entrar');
    await expect(page.getByLabel('E-mail')).toBeFocused();
    await page.keyboard.type(person.email);

    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Senha')).toBeFocused();
    await page.keyboard.type(person.password);

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByLabel('Senha')).toBeFocused();
    await page.keyboard.press('Enter');

    await page.waitForURL((url) => url.pathname === '/');
  });
  test('o menu do avatar aberto não tem violações do axe', async ({
    loggedInPage,
  }) => {
    await loggedInPage
      .getByRole('button', { name: /menu da conta de/ })
      .click();
    await expect(loggedInPage.getByRole('menu')).toBeVisible();

    expect(await violationsOf(loggedInPage)).toEqual([]);
  });
});
