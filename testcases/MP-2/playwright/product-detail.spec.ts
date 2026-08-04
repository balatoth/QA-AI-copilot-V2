import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('Verify Product Detail Page is Displayed', async ({ page }) => {
  await page.goto(baseURL);
  await page.locator('[data-test="product-1"]').click();
  await expect(page).toHaveURL(/product/);
});