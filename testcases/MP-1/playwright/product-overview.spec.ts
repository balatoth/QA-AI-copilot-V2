import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseURL);
    const productCards = page.locator('[data-test="product-1"], [data-test="product-2"], [data-test="product-3"], [data-test="product-4"], [data-test="product-5"], [data-test="product-6"], [data-test="product-7"], [data-test="product-8"], [data-test="product-9"], [data-test="product-10"]');
    await expect(productCards).toBeVisible();
});

test('Navigation to Product Detail Page', async ({ page }) => {
    await page.goto(baseURL);
    await page.locator('[data-test="product-1"]').click();
    await expect(page).toHaveURL(/product/);
});