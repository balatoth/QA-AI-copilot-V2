import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4200/';

test.describe('Product Overview', () => {
  test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productGrid = page.locator('[data-testid="product-grid"]');
    await expect(productGrid).toBeVisible();
  });

  test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCards = page.locator('[data-testid="product-card"]');
    // Assert that there is at least one product card
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    // Iterate over product cards using Locator.nth
    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);
      const image = card.locator('img');
      const name = card.locator('[data-testid="product-name"]');
      const price = card.locator('[data-testid="product-price"]');
      await expect(image).toBeVisible();
      await expect(name).toBeVisible();
      await expect(price).toBeVisible();
    }
  });

  test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto(BASE_URL);
    const firstProductCard = page.locator('[data-testid="product-card"]').first();

    // Capture product name before navigation to verify on detail page
    const productName = await firstProductCard.locator('[data-testid="product-name"]').innerText();

    await firstProductCard.click();

    // Verify URL contains 'product-detail'
    await expect(page).toHaveURL(/.*product-detail/);

    // Verify product detail page shows the same product name
    const detailProductName = page.locator('[data-testid="product-detail-name"]');
    await expect(detailProductName).toBeVisible();
    await expect(detailProductName).toHaveText(productName);
  });
});