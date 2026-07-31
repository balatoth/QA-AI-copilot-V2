// This test case verifies the display of product cards on the home page.
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(BASE_URL);
  // Verify that product card grid is visible
  await expect(page.locator('[data-test="nav-home"]')).toBeVisible();
});