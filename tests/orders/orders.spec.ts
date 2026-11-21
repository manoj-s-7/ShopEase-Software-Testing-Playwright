import { test, expect, resetApp, login, addFirstProduct } from '../fixtures';

test.beforeEach(async ({ page }) => resetApp(page));

async function placeOrder(page: import('@playwright/test').Page) {
  await login(page);
  await addFirstProduct(page);
  await page.goto('/checkout');
  await page.getByTestId('checkout-name').fill('QA Shopper');
  await page.getByTestId('checkout-email').fill('qa@example.test');
  await page.getByTestId('checkout-phone').fill('1234567890');
  await page.getByTestId('checkout-address').fill('123 Test Street');
  await page.getByTestId('checkout-city').fill('Test City');
  await page.getByTestId('checkout-state').fill('Test State');
  await page.getByTestId('checkout-postal').fill('12345');
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('order-success')).toBeVisible();
}

test('ORDER-001: empty order history', async ({ page }) => {
  await login(page);
  await page.goto('/orders');
  await expect(page.getByTestId('orders-empty')).toBeVisible();
});

test('ORDER-002/003/004/005: view new order in history and details', async ({ page }) => {
  await placeOrder(page);
  await page.goto('/orders');
  await expect(page.getByTestId('order-row')).toHaveCount(1);
  await expect(page.getByTestId('order-total')).not.toBeEmpty();
  await page.getByTestId('order-view').click();
  await expect(page.getByTestId('order-id')).not.toBeEmpty();
  await expect(page.getByTestId('order-items')).toBeVisible();
  await expect(page.getByTestId('order-delivery')).toContainText('QA Shopper');
});

test('ORDER-006: advance order status with test helper', async ({ page }) => {
  await placeOrder(page);
  await page.getByTestId('view-order').click();
  await expect(page.getByTestId('order-status')).toHaveText('Processing');
  await page.getByTestId('advance-order-status').click();
  await expect(page.getByTestId('order-status')).toHaveText('Shipped');
  await page.getByTestId('advance-order-status').click();
  await expect(page.getByTestId('order-status')).toHaveText('Delivered');
});

test('ORDER-007: unknown order shows not-found state', async ({ page }) => {
  await login(page);
  await page.goto('/orders/unknown-order');
  await expect(page.getByTestId('order-not-found')).toBeVisible();
});
