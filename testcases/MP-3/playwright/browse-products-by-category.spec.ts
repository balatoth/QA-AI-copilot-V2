import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('Display Category Page on Category Click', async ({ page }) => {
  await page.goto(BASE_URL);
  // Click on the Hand Tools category link
  const handToolsCategory = page.locator('a[data-test="nav-hand-tools"]');
  await expect(handToolsCategory).toBeVisible();
  await handToolsCategory.click();

  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');

  // Verify the URL contains the expected category path
  await expect(page).toHaveURL(/\/category\/hand-tools/);

  // Verify that the category page heading or a unique element is visible
  const categoryHeading = page.locator('h1');
  await expect(categoryHeading).toBeVisible();
  await expect(categoryHeading).toHaveText(/Hand Tools/i);
});