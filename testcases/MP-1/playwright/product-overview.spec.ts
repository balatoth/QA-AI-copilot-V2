import { test, expect } from '@playwright/test';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto('https://v1.practicesoftwaretesting.com');
  await expect(page.locator('[data-test="nav-home"]')).toBeVisible();
  // Verify grid of product cards if a selector is verified in future.
});