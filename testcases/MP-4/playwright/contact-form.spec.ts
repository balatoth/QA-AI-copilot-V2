import { test, expect } from '@playwright/test';

test('TC-001: Verify accessibility of the contact form', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await page.locator('[data-test="nav-contact"]').click();
    // Assert that the contact form or a key element within it is visible
    const contactForm = page.locator('form[data-test="contact-form"]');
    await expect(contactForm).toBeVisible();
});