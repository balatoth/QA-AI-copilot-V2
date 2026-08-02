import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('Display Category Page on Category Click', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('[data-test="nav-hand-tools"]');
    await expect(page).toHaveURL(/hand-tools/);
    // Additional check for confirmation of category page displayed can be added once evidence is available
});