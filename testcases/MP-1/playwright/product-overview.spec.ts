import { test, expect } from '@playwright/test';

test('TC-001 - Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    const productCards = page.locator('[data-test^="product-"]');
    await expect(productCards).toBeVisible();
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
});