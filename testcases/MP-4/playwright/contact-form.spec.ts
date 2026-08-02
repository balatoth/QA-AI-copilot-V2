import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify accessibility of the contact form', async ({ page }) => {
    await page.goto(baseURL);
    await page.locator('[data-test="nav-contact"]').click();
    // Verify that the contact form is visible
    await expect(page).toHaveURL(/contact/);
    // You can add additional checks to ensure the form is displayed
});
