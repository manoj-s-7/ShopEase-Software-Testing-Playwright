import { test, expect, resetApp, addFirstProduct, login } from '../fixtures';

test.beforeEach(async ({ page }) => resetApp(page));

test('CART-001/003: add a product and add the same product twice', async ({ page }) => {
  await addFirstProduct(page);
  await expect(page.getByTestId('cart-count')).toHaveText('1');
  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await page.goto('/shop');
  await page.getByTestId('product-card').first().getByTestId('add-to-cart').click();
  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await expect(page.getByTestId('cart-quantity')).toHaveValue('2');
});

test('CART-002: add multiple distinct products', async ({ page }) => {
  await page.goto('/shop');
  const cards = page.getByTestId('product-card');
  await cards.nth(0).getByTestId('add-to-cart').click();
  await cards.nth(1).getByTestId('add-to-cart').click();
  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('cart-item')).toHaveCount(2);
});

test('CART-004/005: increase and decrease quantity', async ({ page }) => {
  await addFirstProduct(page);
  await page.getByTestId('nav-cart').click();
  await page.getByTestId('cart-quantity-increase').click();
  await expect(page.getByTestId('cart-quantity')).toHaveValue('2');
  await page.getByTestId('cart-quantity-decrease').click();
  await expect(page.getByTestId('cart-quantity')).toHaveValue('1');
});

test('CART-006: remove a product', async ({ page }) => {
  await addFirstProduct(page);
  await page.getByTestId('nav-cart').click();
  await page.getByTestId('cart-remove').click();
  await expect(page.getByTestId('cart-empty')).toBeVisible();
});

test('CART-007: clear cart', async ({ page }) => {
  await page.goto('/shop');
  await page.getByTestId('product-card').nth(0).getByTestId('add-to-cart').click();
  await page.getByTestId('product-card').nth(1).getByTestId('add-to-cart').click();
  await page.getByTestId('nav-cart').click();
  await page.getByTestId('cart-clear').click();
  await expect(page.getByTestId('cart-empty')).toBeVisible();
});

test('CART-008: cart summary shows totals', async ({ page }) => {
  await addFirstProduct(page);
  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('cart-subtotal')).not.toBeEmpty();
  await expect(page.getByTestId('cart-discount')).not.toBeEmpty();
  await expect(page.getByTestId('cart-shipping')).not.toBeEmpty();
  await expect(page.getByTestId('cart-total')).not.toBeEmpty();
});

test('CART-010: guest cart persists after refresh', async ({ page }) => {
  await addFirstProduct(page);
  await page.getByTestId('nav-cart').click();
  await page.reload();
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
});

test('CART-011/012: quantity minimum and typed maximum validation', async ({ page }) => {
  await addFirstProduct(page);
  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('cart-quantity-decrease')).toBeDisabled();
  await page.getByTestId('cart-quantity').fill('999');
  await expect(page.getByTestId('cart-quantity-error')).toContainText('Quantity must be between');
});

test('CART-013: empty cart behavior', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.getByTestId('cart-empty')).toBeVisible();
  await expect(page.getByTestId('empty-cart-shop')).toBeVisible();
});

test('CART-014: guest cart merges after login', async ({ page }) => {
  await addFirstProduct(page);
  await login(page);
  await page.goto('/cart');
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
});
