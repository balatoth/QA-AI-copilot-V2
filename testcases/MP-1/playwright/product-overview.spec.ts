import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://v1.practicesoftwaretesting.com';

const productSelectors = [
  '[data-test="product-1"]',
  '[data-test="product-2"]',
  '[data-test="product-3"]',
  '[data-test="product-4"]',
  '[data-test="product-5"]'
];

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(BASE_URL);

  for (const selector of productSelectors) {
    const productCard = page.locator(selector);
    await expect(productCard).toBeVisible();
  }
});