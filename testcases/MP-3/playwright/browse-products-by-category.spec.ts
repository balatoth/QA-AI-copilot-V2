import { test, expect } from '@playwright/test';

test('TC-001: Display Category Page on Category Click', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await page.locator('[data-test="nav-hand-tools"]').click();
    await expect(page).toHaveURL(/category/);
});