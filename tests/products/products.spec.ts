import { test, expect, resetApp } from '../fixtures';

test.beforeEach(async ({ page }) => resetApp(page));

test('PROD-001/002: homepage and product listing load', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero')).toBeVisible();
  await expect(page.getByTestId('trending-products')).toBeVisible();
  await page.goto('/shop');
  await expect(page.getByTestId('product-card').first()).toBeVisible();
  await expect(page.getByTestId('results-count')).toContainText('products');
});

test('PROD-003: opens product details', async ({ page }) => {
  await page.goto('/shop');
  const card = page.getByTestId('product-card').first();
  await card.getByTestId('product-title').click();
  await expect(page.locator('h1[data-testid="product-title"]')).toBeVisible();
  await expect(page.getByTestId('product-description')).toBeVisible();
  await expect(page.getByTestId('gallery-main-image')).toBeVisible();
  await expect(page.getByTestId('product-availability')).toBeVisible();
});

test('PROD-004/005: searches with matching and unmatched terms', async ({ page }) => {
  await page.goto('/shop');
  await page.getByTestId('product-search').fill('phone');
  await page.getByTestId('search-submit').click();
  await expect(page).toHaveURL(/q=phone/);
  await expect(page.getByTestId('product-card').first()).toBeVisible();

  await page.getByTestId('product-search').fill('zzznoresult999');
  await page.getByTestId('search-submit').click();
  await expect(page.getByTestId('no-results')).toBeVisible();
});

test('PROD-006/007: category filtering and clear filters', async ({ page }) => {
  await page.goto('/shop');
  await page.getByTestId('category-filter').selectOption('smartphones');
  await expect(page).toHaveURL(/category=smartphones/);
  await expect(page.getByTestId('category-filter')).toHaveValue('smartphones');
  await page.getByTestId('clear-filters').click();
  await expect(page).not.toHaveURL(/category=/);
});

test('PROD-008/009/010: sorting options update the URL', async ({ page }) => {
  await page.goto('/shop');
  await page.getByTestId('sort-select').selectOption('price-asc');
  await expect(page).toHaveURL(/sort=price-asc/);
  await page.getByTestId('sort-select').selectOption('price-desc');
  await expect(page).toHaveURL(/sort=price-desc/);
  await page.getByTestId('sort-select').selectOption('rating-desc');
  await expect(page).toHaveURL(/sort=rating-desc/);
});

test('PROD-011: product title navigates to details route', async ({ page }) => {
  await page.goto('/shop');
  const title = page.getByTestId('product-card').first().getByTestId('product-title');
  await title.click();
  await expect(page).toHaveURL(/\/product\/\d+/);
});

test('PROD-012: invalid product route shows not-found state', async ({ page }) => {
  await page.goto('/product/999999');
  await expect(page.getByTestId('product-not-found')).toBeVisible();
});

test('PROD-013: shop displays API failure state and retry', async ({ page }) => {
  await page.route('**/dummyjson.com/**', (route) => route.abort());
  await page.goto('/shop');
  await expect(page.getByTestId('shop-error')).toBeVisible();
  await expect(page.getByTestId('retry-button')).toBeVisible();
});

test('PROD-014: shop displays empty API response state', async ({ page }) => {
  await page.route('**/dummyjson.com/products*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ products: [], total: 0 }) }),
  );
  await page.goto('/shop');
  await expect(page.getByTestId('no-results')).toBeVisible();
});

test('PROD-015: pagination navigation', async ({ page }) => {
  await page.goto('/shop');
  await expect(page.getByTestId('pagination')).toBeVisible();
  await page.getByTestId('pagination').getByRole('button', { name: 'Go to page 2' }).click();
  await expect(page).toHaveURL(/page=2/);
});

test('PROD-016: categories page opens category cards', async ({ page }) => {
  await page.goto('/categories');
  await expect(page.getByTestId('category-grid')).toBeVisible();
  await expect(page.getByTestId('category-card').first()).toBeVisible();
});
