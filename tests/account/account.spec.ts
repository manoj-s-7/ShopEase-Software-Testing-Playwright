import { test, expect, resetApp, login } from '../fixtures';

test.beforeEach(async ({ page }) => resetApp(page));

test('ACC-001: view account details', async ({ page }) => {
  await login(page);
  await page.goto('/account');
  await expect(page.getByTestId('account-name')).toHaveText('Demo Shopper');
  await expect(page.getByTestId('account-email')).toHaveText('demo@shopease.test');
  await expect(page.getByTestId('account-orders')).toBeVisible();
});

test('ACC-002/003: update profile and validate phone', async ({ page }) => {
  await login(page);
  await page.goto('/account');
  await page.getByTestId('profile-name').fill('QA Shopper');
  await page.getByTestId('profile-phone').fill('123');
  await page.getByTestId('profile-address').fill('123 Test Street');
  await page.getByTestId('profile-submit').click();
  await expect(page.getByText('Enter a valid 10-digit phone number.')).toBeVisible();

  await page.getByTestId('profile-phone').fill('1234567890');
  await page.getByTestId('profile-submit').click();
  await expect(page.getByTestId('profile-success')).toBeVisible();
  await expect(page.getByTestId('account-name')).toHaveText('QA Shopper');
});

test('ACC-004: change password successfully', async ({ page }) => {
  await login(page);
  await page.goto('/account');
  await page.getByTestId('current-password').fill('Demo@1234');
  await page.getByTestId('new-password').fill('Qa@12345');
  await page.getByTestId('confirm-new-password').fill('Qa@12345');
  await page.getByTestId('password-submit').click();
  await expect(page.getByTestId('password-success')).toBeVisible();
});

test('ACC-005/006: reject wrong password and mismatched confirmation', async ({ page }) => {
  await login(page);
  await page.goto('/account');
  await page.getByTestId('current-password').fill('Wrong@123');
  await page.getByTestId('new-password').fill('Qa@12345');
  await page.getByTestId('confirm-new-password').fill('Qa@12346');
  await page.getByTestId('password-submit').click();
  await expect(page.getByText('Passwords do not match.')).toBeVisible();
});

test('ACC-007: logout from account menu', async ({ page }) => {
  await login(page);
  await page.getByTestId('nav-account-menu').click();
  await page.getByTestId('nav-logout').click();
  await page.goto('/account');
  await expect(page).toHaveURL(/\/login/);
});
