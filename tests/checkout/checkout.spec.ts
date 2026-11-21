import { test, expect, resetApp, login, addFirstProduct } from '../fixtures';

test.beforeEach(async ({ page }) => resetApp(page));

async function fillDelivery(page: import('@playwright/test').Page) {
  await page.getByTestId('checkout-name').fill('QA Shopper');
  await page.getByTestId('checkout-email').fill('qa@example.test');
  await page.getByTestId('checkout-phone').fill('1234567890');
  await page.getByTestId('checkout-address').fill('123 Test Street');
  await page.getByTestId('checkout-city').fill('Test City');
  await page.getByTestId('checkout-state').fill('Test State');
  await page.getByTestId('checkout-postal').fill('12345');
}

test('CHECK-001: empty checkout shows empty-cart state', async ({ page }) => {
  await login(page);
  await page.goto('/checkout');
  await expect(page.getByTestId('checkout-empty')).toBeVisible();
});

test('CHECK-002/003/004/005/006/007: checkout access and field validation', async ({ page }) => {
  await login(page);
  await addFirstProduct(page);
  await page.goto('/cart');
  await page.getByTestId('checkout-button').click();
  await expect(page.getByTestId('checkout-form')).toBeVisible();

  await page.getByTestId('checkout-name').fill('');
  await page.getByTestId('place-order').click();
  await expect(page.getByText('Full name is required.')).toBeVisible();

  await fillDelivery(page);
  await page.getByTestId('checkout-email').fill('invalid-email');
  await page.getByTestId('checkout-phone').fill('123');
  await page.getByTestId('checkout-postal').fill('123');
  await page.getByTestId('checkout-address').fill('123');
  await page.getByTestId('place-order').click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await expect(page.getByText('Enter a valid 10-digit phone number.')).toBeVisible();
  await expect(page.getByText('Enter a valid 5 or 6 digit postal code.')).toBeVisible();
});

test('CHECK-008/011: successful COD checkout creates order', async ({ page }) => {
  await login(page);
  await addFirstProduct(page);
  await page.goto('/checkout');
  await fillDelivery(page);
  await page.getByTestId('payment-cod').check();
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('order-success')).toBeVisible();
  await expect(page.getByTestId('order-id')).not.toBeEmpty();
  await expect(page.getByTestId('order-total')).not.toBeEmpty();
});

test('CHECK-009: successful demo-card checkout', async ({ page }) => {
  await login(page);
  await addFirstProduct(page);
  await page.goto('/checkout');
  await fillDelivery(page);
  await page.getByTestId('payment-card').check();
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('order-success')).toBeVisible();
  await page.getByTestId('view-order').click();
  await expect(page.getByTestId('order-payment')).toHaveText('Demo Card Payment');
});

test('CHECK-010: successful checkout clears cart', async ({ page }) => {
  await login(page);
  await addFirstProduct(page);
  await page.goto('/checkout');
  await fillDelivery(page);
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('order-success')).toBeVisible();
  await page.goto('/cart');
  await expect(page.getByTestId('cart-empty')).toBeVisible();
});
