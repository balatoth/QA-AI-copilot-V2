import { test, expect } from '@playwright/test';

test('TC-001 - Verify Product Detail Page is Displayed', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('https://v1.practicesoftwaretesting.com');
    
    // Click on a product
    await page.locator('[data-test="product-1"]').click();
    
    // Assertion to check if the product detail page appears
    await expect(page).toHaveURL(/product/);
});