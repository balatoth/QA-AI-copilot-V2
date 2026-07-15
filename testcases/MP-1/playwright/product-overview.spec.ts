import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test.describe('Product Overview', () => {
  test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productGrid = page.locator('[data-testid="product-grid"]');
    await expect(productGrid).toBeVisible();
  });

  test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCountGreaterThan(0);

    const count = await productCards.count();
    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);
      const image = card.locator('img');
      const name = card.locator('[data-testid="product-name"]');
      const price = card.locator('[data-testid="product-price"]');

      await expect(image).toBeVisible();
      await expect(name).toHaveText(/\S+/); // non-empty text
      await expect(price).toHaveText(/\$?\d+(\.\d{2})?/); // price format like $12.34 or 12.34
    }
  });

  test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto(BASE_URL);
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    await firstProductCard.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Check URL contains /product-details/ and a numeric id
    await expect(page).toHaveURL(/\/product-details\/\d+$/);

    // Additionally verify presence of product detail container
    const productDetail = page.locator('[data-testid="product-detail"]');
    await expect(productDetail).toBeVisible();
  });
});