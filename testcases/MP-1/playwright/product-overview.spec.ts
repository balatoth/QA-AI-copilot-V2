import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(baseUrl);
  const productCard = page.locator('[data-test="product-1"]');
  await expect(productCard).toBeVisible();
});