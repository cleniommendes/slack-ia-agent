import { expect, test } from './fixtures';

test('mostra o shell da Home com as iniciais da Pessoa', async ({
  loggedInPage: page,
}) => {
  const rail = page.getByRole('navigation', { name: 'Seções' });

  await expect(rail.getByText('FC', { exact: true })).toBeVisible();
  await expect(rail.getByRole('link', { name: 'Início' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(rail.getByRole('img', { name: 'Ana Souza' })).toHaveText('AS');
  await expect(page.getByRole('complementary')).toHaveText('Clenio');
  await expect(page.getByText('Nenhuma conversa ainda')).toBeVisible();
  await expect(
    page.getByText('Crie um canal ou comece uma conversa pela barra lateral.'),
  ).toBeVisible();
  await expect(page.getByText('Atividade')).toHaveCount(0);
});
