import { test, expect } from '@playwright/test';

test('TC-001: Display Category Page on Category Click', async ({ page }) => {
  await page.goto('https://v1.practicesoftwaretesting.com');
  // Click on the Hand Tools category link
  await page.click('[data-test="nav-hand-tools"]');
  // Verify the URL contains 'hand-tools'
  await expect(page).toHaveURL(/hand-tools/);
  // Verify the category page heading or a unique element is visible
  await expect(page.locator('h1')).toHaveText(/Hand Tools/i);
});