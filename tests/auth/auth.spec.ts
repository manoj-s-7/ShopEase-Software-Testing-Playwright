import { test, expect, DEMO_USER, resetApp, login } from '../fixtures';

test.beforeEach(async ({ page }) => resetApp(page));

test('AUTH-001: logs in with valid demo credentials', async ({ page }) => {
  await login(page);
  await page.goto('/account');
  await expect(page.getByTestId('account-email')).toHaveText(DEMO_USER.email);
});

test('AUTH-002/003: rejects unknown email and incorrect password', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('missing@shopease.test');
  await page.getByTestId('login-password').fill(DEMO_USER.password);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('login-error')).toHaveText('Invalid email or password.');

  await page.getByTestId('login-email').fill(DEMO_USER.email);
  await page.getByTestId('login-password').fill('Wrong@123');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('login-error')).toHaveText('Invalid email or password.');
});

test('AUTH-004/005: validates empty and malformed login fields', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-submit').click();
  await expect(page.getByText('Email is required.')).toBeVisible();
  await expect(page.getByText('Password is required.')).toBeVisible();

  await page.getByTestId('login-email').fill('invalid-email');
  await page.getByTestId('login-password').fill(DEMO_USER.password);
  await page.getByTestId('login-submit').click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
});

test('AUTH-006: toggles password visibility', async ({ page }) => {
  await page.goto('/login');
  const password = page.getByTestId('login-password');
  await password.fill('Demo@1234');
  await expect(password).toHaveAttribute('type', 'password');
  await page.getByTestId('login-password-toggle').click();
  await expect(password).toHaveAttribute('type', 'text');
});

test('AUTH-007: remember-me session persists after refresh', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill(DEMO_USER.email);
  await page.getByTestId('login-password').fill(DEMO_USER.password);
  await page.getByTestId('login-remember').check();
  await page.getByTestId('login-submit').click();
  await page.reload();
  await page.goto('/account');
  await expect(page.getByTestId('account-email')).toHaveText(DEMO_USER.email);
});

test('AUTH-009: logs out successfully', async ({ page }) => {
  await login(page);
  await page.getByTestId('nav-account-menu').click();
  await page.getByTestId('nav-logout').click();
  await expect(page.getByTestId('nav-login')).toBeVisible();
  await page.goto('/account');
  await expect(page).toHaveURL(/\/login/);
});

test('AUTH-010/011/012: protected routes redirect guests to login', async ({ page }) => {
  for (const route of ['/account', '/wishlist', '/checkout', '/orders']) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-notice')).toBeVisible();
  }
});

test('AUTH-013: registers a valid new account', async ({ page }) => {
  const suffix = Date.now();
  await page.goto('/register');
  await page.getByTestId('register-name').fill('QA Shopper');
  await page.getByTestId('register-email').fill(`qa${suffix}@example.test`);
  await page.getByTestId('register-password').fill('Qa@12345');
  await page.getByTestId('register-confirm-password').fill('Qa@12345');
  await page.getByTestId('register-terms').check();
  await page.getByTestId('register-submit').click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByTestId('login-notice')).toContainText('Account created successfully');
});

test('AUTH-014: rejects an existing registration email', async ({ page }) => {
  await page.goto('/register');
  await page.getByTestId('register-name').fill('Demo Shopper');
  await page.getByTestId('register-email').fill(DEMO_USER.email);
  await page.getByTestId('register-password').fill('Qa@12345');
  await page.getByTestId('register-confirm-password').fill('Qa@12345');
  await page.getByTestId('register-terms').check();
  await page.getByTestId('register-submit').click();
  await expect(page.getByText('An account with this email already exists.')).toBeVisible();
});

test('AUTH-015/016/017/018: validates registration constraints', async ({ page }) => {
  await page.goto('/register');
  await page.getByTestId('register-submit').click();
  await expect(page.getByTestId('register-name-error')).toBeVisible();
  await expect(page.getByTestId('register-terms-error')).toBeVisible();

  await page.getByTestId('register-name').fill('QA Shopper');
  await page.getByTestId('register-email').fill('qa-validation@example.test');
  await page.getByTestId('register-password').fill('Abc123');
  await page.getByTestId('register-confirm-password').fill('Different@1');
  await page.getByTestId('register-terms').check();
  await page.getByTestId('register-submit').click();
  await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible();
  await expect(page.getByText('Passwords do not match.')).toBeVisible();
});
