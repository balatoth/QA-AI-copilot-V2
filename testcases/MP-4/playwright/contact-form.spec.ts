import { test, expect } from '@playwright/test';

test('TC-001: Verify accessibility of the contact form', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await page.locator('[data-test="nav-contact"]').click();
    const form = await page.locator('[data-test="contact-form"]');
    await expect(form).toBeVisible();
});
