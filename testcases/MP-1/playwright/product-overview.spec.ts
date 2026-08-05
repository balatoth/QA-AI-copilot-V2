import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001 - Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCards = page.locator('[data-test="product-1"],[data-test="product-2"],[data-test="product-3"],[data-test="product-4"],[data-test="product-5"],[data-test="product-6"],[data-test="product-7"],[data-test="product-8"],[data-test="product-9"],[data-test="product-10"],[data-test="product-11"],[data-test="product-12"],[data-test="product-13"],[data-test="product-14"],[data-test="product-15"],[data-test="product-16"],[data-test="product-17"],[data-test="product-18"],[data-test="product-19"],[data-test="product-20"],[data-test="product-21"],[data-test="product-22"],[data-test="product-23"],[data-test="product-24"],[data-test="product-25"],[data-test="product-26"]");
    await expect(productCards).toBeVisible();
});