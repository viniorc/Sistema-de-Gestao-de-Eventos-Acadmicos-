import { expect, test } from '@playwright/test';

test('redirects an unauthenticated visitor from dashboard to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: /acesso ao sistema/i })).toBeVisible();
});

test('authenticates the development user and shows dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/e-mail institucional/i).fill('mariana@conexao.local');
  await page.getByLabel(/^senha$/i).fill(process.env.E2E_DEV_USER_PASSWORD ?? 'local-dev-password');
  await page.getByRole('button', { name: /^entrar$/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /visão geral/i })).toBeVisible();
  await expect(page.getByText('Mariana Costa')).toBeVisible();
});
