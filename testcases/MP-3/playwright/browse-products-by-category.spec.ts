import { test, expect } from '@playwright/test';

// Test Case ID: TC-001
// Verify that clicking on the 'Hand Tools' category navigates to the correct category page

test('TC-001: Display Category Page on Category Click', async ({ page }) => {
  await page.goto('https://v1.practicesoftwaretesting.com');

  // Click on the Hand Tools category link using a robust selector
  const handToolsCategory = page.locator('nav [data-test="nav-hand-tools"]');
  await expect(handToolsCategory).toBeVisible();
  await handToolsCategory.click();

  // Verify the URL contains 'hand-tools'
  await expect(page).toHaveURL(/hand-tools/);

  // Verify the category page heading is visible and contains 'Hand Tools'
  const categoryHeading = page.locator('h1');
  await expect(categoryHeading).toBeVisible();
  await expect(categoryHeading).toHaveText(/Hand Tools/i);
});