import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test.describe('Browse Products by Category', () => {
  test('Display Category Page on Category Click', async ({ page }) => {
    await page.goto(`${baseURL}`);
    await page.locator('[data-test="nav-hand-tools"]').click();
    await expect(page).toHaveURL(/hand-tools/);
  });
});