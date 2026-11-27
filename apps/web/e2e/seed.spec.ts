import { expect, test } from './fixtures';

test('abre a web em Entrar com uma Pessoa pronta', async ({ page, person }) => {
  const response = await page.goto('/entrar');

  expect(response?.status()).toBe(200);
  await expect(page.getByLabel('E-mail')).toBeVisible();
  expect(person.email).toMatch(/^e2e-.+@teste\.local$/);
});
