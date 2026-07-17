import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4200/';

test.describe('Product Overview', () => {
  test('TC-001: Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productGrid = await page.locator('[data-testid="filters"]').isVisible();
    expect(productGrid).toBe(true);
  });

  test('TC-002: Verify product card details are displayed', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCard = await page.locator('[data-testid="filters"]').nth(0);
    const isVisible = await productCard.isVisible();
    expect(isVisible).toBe(true);
    expect(await productCard.locator('img').count()).toBeGreaterThan(0);
    expect(await productCard.locator('text=Price').count()).toBeGreaterThan(0);
  });
  
  test('TC-003: Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCard = await page.locator('[data-testid="filters"]').nth(0);
    await productCard.click();
    const url = page.url();
    expect(url).toContain('/product-detail'); // Assuming the detail page URL contains '/product-detail'
  });
});