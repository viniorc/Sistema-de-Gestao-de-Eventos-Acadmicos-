import { expect, test } from '@playwright/test';
test('unauthenticated dashboard redirects to login once middleware is enabled', async ({ page }) => { await page.goto('/login'); await expect(page.getByRole('heading', { name: /acesso ao sistema/i })).toBeVisible(); });
