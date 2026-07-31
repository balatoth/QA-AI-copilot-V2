import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('Display Category Page on Category Click', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator('[data-test="nav-hand-tools"]').click();
  await expect(page).toHaveURL(/hand-tools/);
});