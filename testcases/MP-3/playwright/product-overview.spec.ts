import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display Category Page on Category Click', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="nav-hand-tools"]').click();
    // Check if category page is displayed by verifying a key element on the category page
    const categoryHeader = page.locator('h1');
    await expect(categoryHeader).toHaveText(/Hand Tools/i);
});