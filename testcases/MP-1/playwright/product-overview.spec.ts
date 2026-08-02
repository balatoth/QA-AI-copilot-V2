import { test, expect } from '@playwright/test';

test('TC-001 - Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await expect(page.locator('[data-test="product-1"]')).toBeVisible();
    await expect(page.locator('[data-test="product-2"]')).toBeVisible();
    await expect(page.locator('[data-test="product-3"]')).toBeVisible();
    await expect(page.locator('[data-test="product-4"]')).toBeVisible();
    await expect(page.locator('[data-test="product-5"]')).toBeVisible();
});