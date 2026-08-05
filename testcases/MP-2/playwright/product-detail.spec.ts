import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test('TC-001 - Verify Product Detail Page is Displayed', async ({ page }) => {
  await page.goto(baseUrl);
  await page.click('[data-test="product-1"]');
  await expect(page.locator('[data-test="product-name"]')).toBeVisible();
});