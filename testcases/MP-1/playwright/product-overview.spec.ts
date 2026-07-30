import { test, expect } from '@playwright/test';

test('Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto('https://v1.practicesoftwaretesting.com');
  // Use a stable and verified selector for product cards container
  const productGrid = page.locator('[data-test="product-card"]');
  await expect(productGrid.first()).toBeVisible();
});