import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseURL);
    const product1 = page.locator('[data-test="product-1"]');
    const product2 = page.locator('[data-test="product-2"]');
    const product3 = page.locator('[data-test="product-3"]');
    const product4 = page.locator('[data-test="product-4"]');
    const product5 = page.locator('[data-test="product-5"]');

    await expect(product1).toBeVisible();
    await expect(product2).toBeVisible();
    await expect(product3).toBeVisible();
    await expect(product4).toBeVisible();
    await expect(product5).toBeVisible();
});