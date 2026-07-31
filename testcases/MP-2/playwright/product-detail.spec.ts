import { test, expect } from '@playwright/test';

test('TC-001: Verify Product Detail Page is Displayed', async ({ page }) => {
  await page.goto('https://v1.practicesoftwaretesting.com');
  await page.locator('[data-test="product-1"]').click();
  await expect(page).toHaveURL(/product/);
});