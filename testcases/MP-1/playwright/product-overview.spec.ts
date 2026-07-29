import { test, expect } from '@playwright/test';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    const productGrid = page.locator('[data-test="product-1"]');
    await expect(productGrid).toBeVisible();
});