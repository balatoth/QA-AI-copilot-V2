import { test, expect } from '@playwright/test';

test('TC-001: Verify Category Page Display', async ({ page }) => {
    await page.goto('https://v2.practicesoftwaretesting.com/#/');
    await page.click(page.getByRole('link', { name: 'Cloudflare' }));
    await expect(page).toHaveURL('https://v2.practicesoftwaretesting.com/#/category/hand-tools');
    // Assuming the category page title is 'Hand Tools - Practice Software Testing'
    await expect(page).toHaveTitle(/Hand Tools/i);
    // Add assertions for product visibility as per evidence
    // Example: Check that at least one product item is visible
    const productItems = page.locator('.product-item');
    await expect(productItems.first()).toBeVisible();
});