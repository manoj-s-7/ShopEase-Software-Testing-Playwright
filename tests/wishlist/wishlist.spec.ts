import { test, expect, resetApp, login, addFirstProduct } from '../fixtures';

test.beforeEach(async ({ page }) => resetApp(page));

test('WISH-001: guest cannot access wishlist', async ({ page }) => {
  await page.goto('/wishlist');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByTestId('login-notice')).toContainText('wishlist');
});

test('WISH-002/004/007: add, persist and toggle wishlist', async ({ page }) => {
  await login(page);
  await page.goto('/shop');
  await page.getByTestId('product-card').first().getByTestId('wishlist-toggle').click();
  await page.goto('/wishlist');
  await expect(page.getByTestId('wishlist-item')).toHaveCount(1);
  await page.reload();
  await expect(page.getByTestId('wishlist-item')).toHaveCount(1);
  await page.getByTestId('wishlist-item').getByTestId('wishlist-item-title').click();
  await page.getByTestId('wishlist-toggle').click();
  await page.goto('/wishlist');
  await expect(page.getByTestId('wishlist-empty')).toBeVisible();
});

test('WISH-003/005: remove from wishlist and view empty state', async ({ page }) => {
  await login(page);
  await page.goto('/shop');
  await page.getByTestId('product-card').first().getByTestId('wishlist-toggle').click();
  await page.goto('/wishlist');
  await page.getByTestId('wishlist-remove').click();
  await expect(page.getByTestId('wishlist-empty')).toBeVisible();
});

test('WISH-006: move wishlist product to cart', async ({ page }) => {
  await login(page);
  await page.goto('/shop');
  await page.getByTestId('product-card').first().getByTestId('wishlist-toggle').click();
  await page.goto('/wishlist');
  await page.getByTestId('wishlist-move-to-cart').click();
  await expect(page.getByTestId('wishlist-empty')).toBeVisible();
  await page.goto('/cart');
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
});
