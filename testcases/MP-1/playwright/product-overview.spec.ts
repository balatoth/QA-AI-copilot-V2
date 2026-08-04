import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test.describe('Product Overview', () => {
  test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCard = page.locator('[data-test="product-1"]');
    await expect(productCard).toBeVisible({ timeout: 5000 });
  });

  test('TC-003: Navigation to Product Detail Page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCard = page.locator('[data-test="product-1"]');
    await expect(productCard).toBeVisible({ timeout: 5000 });
    await productCard.click();
    await expect(page).toHaveURL(/\/product\//, { timeout: 5000 });
  });
});