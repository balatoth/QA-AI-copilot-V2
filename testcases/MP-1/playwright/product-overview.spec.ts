import { test, expect } from '@playwright/test';

test('Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await expect(page.locator('[data-test="nav-home"]')).toBeVisible();
    // Ensure product cards are displayed (Note: This will need an update with a valid selector when available).
});