import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('[TC-001] Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-test="product-1"]')).toBeVisible();
    await expect(page.locator('[data-test="product-2"]')).toBeVisible();
    await expect(page.locator('[data-test="product-3"]')).toBeVisible();
    await expect(page.locator('[data-test="product-4"]')).toBeVisible();
    await expect(page.locator('[data-test="product-5"]')).toBeVisible();
});