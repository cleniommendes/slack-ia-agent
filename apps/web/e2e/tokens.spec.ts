import { expect, test, type Page } from '@playwright/test';

/** Cor resolvida (rgb) de um token, lida por um elemento de sonda. */
function tokenColor(page: Page, name: string) {
  return page.evaluate((variable) => {
    const probe = document.createElement('div');
    probe.style.color = `var(${variable})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, name);
}

test.describe('tokens do design system', () => {
  test('usa os tokens do tema claro por padrão', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('/');

    expect(await tokenColor(page, '--surface')).toBe('rgb(255, 255, 255)');
    expect(await tokenColor(page, '--fg')).toBe('rgb(29, 28, 29)');
    expect(await tokenColor(page, '--primary')).toBe('rgb(0, 122, 90)');
    expect(await tokenColor(page, '--sidebar')).toBe('rgb(63, 14, 64)');
  });

  test('troca para os tokens do escuro só com data-theme=dark', async ({
    page,
  }) => {
    await page.goto('/');

    await page.evaluate(() =>
      document.documentElement.setAttribute('data-theme', 'dark'),
    );

    expect(await tokenColor(page, '--surface')).toBe('rgb(26, 29, 33)');
    expect(await tokenColor(page, '--sidebar')).toBe('rgb(25, 23, 29)');
    expect(await tokenColor(page, '--primary')).toBe('rgb(0, 122, 90)');
    expect(await tokenColor(page, '--sidebar-active')).toBe(
      'rgb(18, 100, 163)',
    );
  });

  test('usa a fonte Lato', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toHaveCSS('font-family', /lato/i);
  });

  test('não serve mais a página inicial do esqueleto', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('To get started')).toHaveCount(0);
  });
});
