import { test, expect } from '@playwright/test';

const baseURL = 'https://v2.practicesoftwaretesting.com';

test('TC-001 - Verify category page displays the correct products and title', async ({ page }) => {
  await page.goto(baseURL);
  await page.click('[data-test="nav-hand-tools"]');

  await expect(page).toHaveURL(/\w+\/hand-tools/);
  await expect(page).toHaveTitle(/Hand Tools/);
  await expect(page.locator('[data-test="product-name"]')).toBeVisible();
  await expect(page.locator('[data-test="product-1"]')).toBeVisible();
  await expect(page.locator('[data-test="product-2"]')).toBeVisible();
  await expect(page.locator('[data-test="product-3"]')).toBeVisible();
});