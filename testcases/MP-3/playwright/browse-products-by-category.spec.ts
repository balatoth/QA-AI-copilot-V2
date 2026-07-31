import { test, expect } from '@playwright/test';

test('Display Category Page on Category Click - TC-001', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await page.locator('[data-test="nav-hand-tools"]').click();
    await expect(page).toHaveURL(/hand-tools/);
});