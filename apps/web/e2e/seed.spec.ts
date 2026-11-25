import { expect, test } from '@playwright/test';

test('abre a web', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(404);
  await expect(page.getByText('This page could not be found.')).toBeVisible();
});
