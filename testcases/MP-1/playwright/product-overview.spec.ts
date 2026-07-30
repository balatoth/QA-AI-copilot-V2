import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseURL);
    const productCards = await page.locator('[data-test="product-1"]').count();
    expect(productCards).toBeGreaterThan(0);
});