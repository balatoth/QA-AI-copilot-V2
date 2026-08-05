import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify Product Detail Page is Displayed', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('[data-test="product-1"]');
    await expect(page.locator('[data-test="product-name"]')).toBeVisible();
});