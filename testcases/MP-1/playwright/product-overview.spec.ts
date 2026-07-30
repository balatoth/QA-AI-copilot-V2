import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseURL);
    const productCards = page.locator('[data-test="product-1"]').locator('a');
    await expect(productCards).toHaveCount(26);
});


test('TC-003: Navigation to Product Detail Page', async ({ page }) => {
    await page.goto(baseURL);
    const productCard = page.locator('[data-test="product-1"]');
    await productCard.click();
    await expect(page).toHaveURL(/\/product\/1/);
});