import { test, expect } from '@playwright/test';

test('Verify Product Detail Page is Displayed', async ({ page }) => {
  await page.goto('https://v1.practicesoftwaretesting.com');
  await page.click('[data-test="product-1"]');
  await expect(page).toHaveURL(/product/);
  await expect(page.locator('[data-test="product-name"]')).toBeVisible();
});