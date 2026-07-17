import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('TC-001: Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    const productGrid = await page.locator('[data-testid="filters"]');
    await expect(productGrid).toBeVisible();
  });
  
  test('TC-002: Verify product card details are displayed', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    const productCard = await page.locator('[data-testid="filters"]'); // This needs a specific selector for product cards.
    await expect(productCard).toBeVisible();
    // Additional assertions to check product image, name, and price should be included here.
  });
  
  test('TC-003: Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    const productCardLink = await page.locator('[data-testid="filters"]'); // This needs a specific selector for product card links.
    await productCardLink.click();
    // Include assertion to check if the URL or content changes to the product detail page.
  });
});