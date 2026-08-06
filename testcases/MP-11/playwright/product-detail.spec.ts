import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v2.practicesoftwaretesting.com';

test('TC-001: Verify all product information is displayed on the product detail page', async ({ page }) => {
    await page.goto(BASE_URL + '/product-detail'); // Adjust the path as necessary
    await expect(page.locator('[data-test="product-name"]')).toBeVisible();
    await expect(page.locator('[data-test="product-price"]')).toBeVisible();
    // Add checks for the other product information selectors as needed
});