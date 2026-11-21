import { expect, test } from '@playwright/test';

test.describe('deployed application smoke tests', () => {
  test('loads the storefront and direct React Router routes', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShopEase/i);

    await page.goto('/shop');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto('/product/1');
    await expect(page).not.toHaveURL(/404/);
  });
});
