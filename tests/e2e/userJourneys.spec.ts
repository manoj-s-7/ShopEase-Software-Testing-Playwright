import { test, expect, resetApp, login, DEMO_USER } from '../fixtures';

test.beforeEach(async ({ page }) => resetApp(page));

async function fillValidCheckout(page: import('@playwright/test').Page) {
  await page.getByTestId('checkout-name').fill('Journey Shopper');
  await page.getByTestId('checkout-email').fill('journey@example.test');
  await page.getByTestId('checkout-phone').fill('1234567890');
  await page.getByTestId('checkout-address').fill('123 Journey Street');
  await page.getByTestId('checkout-city').fill('Journey City');
  await page.getByTestId('checkout-state').fill('Journey State');
  await page.getByTestId('checkout-postal').fill('12345');
}

test('E2E-001: register, login, browse, add to cart and checkout', async ({ page }) => {
  const email = `journey${Date.now()}@example.test`;
  await page.goto('/register');
  await page.getByTestId('register-name').fill('Journey Shopper');
  await page.getByTestId('register-email').fill(email);
  await page.getByTestId('register-password').fill('Qa@12345');
  await page.getByTestId('register-confirm-password').fill('Qa@12345');
  await page.getByTestId('register-terms').check();
  await page.getByTestId('register-submit').click();
  await login(page, email, 'Qa@12345');
  await page.goto('/shop');
  await page.getByTestId('product-card').first().getByTestId('add-to-cart').click();
  await page.goto('/checkout');
  await fillValidCheckout(page);
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('order-success')).toBeVisible();
  await page.goto('/cart');
  await expect(page.getByTestId('cart-empty')).toBeVisible();
});

test('E2E-002: search, wishlist, move to cart and checkout', async ({ page }) => {
  await login(page);
  await page.goto('/shop');
  await page.getByTestId('product-search').fill('phone');
  await page.getByTestId('search-submit').click();
  await page.getByTestId('product-card').first().getByTestId('wishlist-toggle').click();
  await page.goto('/wishlist');
  await page.getByTestId('wishlist-move-to-cart').click();
  await page.goto('/checkout');
  await fillValidCheckout(page);
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('order-success')).toBeVisible();
});

test('E2E-003: add, update and remove cart products', async ({ page }) => {
  await login(page);
  await page.goto('/shop');
  await page.getByTestId('product-card').nth(0).getByTestId('add-to-cart').click();
  await page.getByTestId('product-card').nth(1).getByTestId('add-to-cart').click();
  await page.goto('/cart');
  await page.getByTestId('cart-item').first().getByTestId('cart-quantity-increase').click();
  await expect(page.getByTestId('cart-item').first().getByTestId('cart-quantity')).toHaveValue('2');
  await page.getByTestId('cart-item').last().getByTestId('cart-remove').click();
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await expect(page.getByTestId('cart-total')).not.toBeEmpty();
});

test('E2E-004: place order and view order details', async ({ page }) => {
  await login(page);
  await page.goto('/shop');
  await page.getByTestId('product-card').first().getByTestId('add-to-cart').click();
  await page.goto('/checkout');
  await fillValidCheckout(page);
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('order-success')).toBeVisible();
  await page.goto('/orders');
  await expect(page.getByTestId('order-row')).toHaveCount(1);
  await page.getByTestId('order-view').click();
  await expect(page.getByTestId('order-items')).toBeVisible();
});

test('E2E-005: logout then protected account route redirects', async ({ page }) => {
  await login(page);
  await page.getByTestId('nav-account-menu').click();
  await page.getByTestId('nav-logout').click();
  await page.goto('/account');
  await expect(page).toHaveURL(/\/login/);
});
