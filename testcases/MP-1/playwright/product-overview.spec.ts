import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.locator('[data-test="product-1"]')).toBeVisible();
    await expect(page.locator('[data-test="product-2"]')).toBeVisible();
    await expect(page.locator('[data-test="product-3"]')).toBeVisible();
});