import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test.describe('Product Overview', () => {
  test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseURL);
    const productCards = await page.locator('a[data-test^="product-"]');
    await expect(productCards).toHaveCount(26);
    await expect(productCards).toBeVisible();
  });

  test('TC-002: Product Card Content Verification', async ({ page }) => {
    await page.goto(baseURL);
    const productCount = await page.locator('a[data-test^="product-"]').count();
    for (let i = 1; i <= productCount; i++) {
      const productNameLocator = page.locator(`[data-test="product-${i}"] strong`);
      const productPriceLocator = page.locator(`[data-test="product-${i}"] span`);

      await expect(productNameLocator).toBeVisible();
      await expect(productPriceLocator).toBeVisible();
    }
  });

  test('TC-003: Navigation to Product Detail Page', async ({ page }) => {
    await page.goto(baseURL);
    const firstProductCard = page.locator('[data-test="product-1"]');
    await firstProductCard.click();
    await expect(page).toHaveURL(/product-1/);
  });
});
