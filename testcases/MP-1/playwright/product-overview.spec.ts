import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test('Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.locator('[data-test="product-1"]')).toBeVisible();
    await expect(page.locator('[data-test="product-2"]')).toBeVisible();
    await expect(page.locator('[data-test="product-3"]')).toBeVisible();
});