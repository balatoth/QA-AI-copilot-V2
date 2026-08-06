import { test, expect } from '@playwright/test';

test('TC-001: Verify category name opens corresponding product page', async ({ page }) => {
    await page.goto('https://v2.practicesoftwaretesting.com');
    await page.click('[data-test="nav-hand-tools"]');

    // Verify product page is displayed
    await expect(page.locator('[data-test="product-name"]')).toBeVisible();

    // Verify page title is updated
    await expect(page).toHaveTitle(/Hand Tools/);
});