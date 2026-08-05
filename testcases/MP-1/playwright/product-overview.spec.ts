import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-test="nav-home"]')).toBeVisible();
    // Verify that product cards are displayed, further verification can be added here.
});