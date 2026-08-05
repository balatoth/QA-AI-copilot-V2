import { test, expect } from '@playwright/test';

test('TC-001: Verify Product Detail Page is Displayed', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await page.click('[data-test="product-1"]');
    await expect(page).toHaveURL(/\/product\/1/);
    await expect(page.locator('[data-test="product-name"]')).toBeVisible();
});