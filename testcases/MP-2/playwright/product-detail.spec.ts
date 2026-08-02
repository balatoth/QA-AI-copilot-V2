import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify Product Detail Page is Displayed', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('[data-test="product-1"]').click();
  await expect(page).toHaveURL(/product/);
});
