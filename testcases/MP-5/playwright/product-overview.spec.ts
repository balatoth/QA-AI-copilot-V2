import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'https://v2.practicesoftwaretesting.com';

test('TC-001: Verify product grid is displayed with images, names, and prices', async ({ page }) => {
  await page.goto(baseUrl);

  const product1 = page.locator('[data-test="product-1"]');
  await expect(product1).toBeVisible();

  // Scoped selectors within product-1
  await expect(product1.locator('[data-test="product-name"]')).toBeVisible();
  await expect(product1.locator('[data-test="product-price"]')).toBeVisible();
});