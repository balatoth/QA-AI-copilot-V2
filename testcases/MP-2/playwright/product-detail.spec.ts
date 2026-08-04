import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify Product Detail Page is Displayed', async ({ page }) => {
  await page.goto(baseURL);
  // Wait for the product list to be visible
  await expect(page.locator('[data-test="product-1"]')).toBeVisible();
  await page.click('[data-test="product-1"]');
  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');
  // Verify product name is visible and contains text
  const productName = page.locator('[data-test="product-name"]');
  await expect(productName).toBeVisible();
  await expect(productName).not.toBeEmpty();
});