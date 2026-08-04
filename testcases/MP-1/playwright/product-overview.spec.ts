import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await expect(page.locator('[data-test="product-1"]')).toBeVisible();
  });

  test('Navigation to Product Detail Page', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await page.locator('[data-test="product-1"]').click();
    await expect(page).toHaveURL(/product/);
  });
});