import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001 - Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseURL);
    const productGrid = page.locator('[data-test="nav-home"]');
    await expect(productGrid).toBeVisible();
});