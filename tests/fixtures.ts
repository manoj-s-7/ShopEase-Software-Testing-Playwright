import { test as base, expect, type Page } from '@playwright/test';

export const DEMO_USER = {
  email: 'demo@shopease.test',
  password: 'Demo@1234',
};

export async function resetApp(page: Page): Promise<void> {
  await page.goto('/dev/reset');
  await expect(page).toHaveURL(/\/$/);
}

export async function login(page: Page, email = DEMO_USER.email, password = DEMO_USER.password): Promise<void> {
  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
  await expect(page).not.toHaveURL(/\/login(?:[?#]|$)/);
}

export async function addFirstProduct(page: Page): Promise<void> {
  await page.goto('/shop');
  await expect(page.getByTestId('product-card').first()).toBeVisible();
  await page.getByTestId('product-card').first().getByTestId('add-to-cart').click();
  await expect(page.getByTestId('toast')).toBeVisible();
}

export const test = base.extend({});
export { expect };
