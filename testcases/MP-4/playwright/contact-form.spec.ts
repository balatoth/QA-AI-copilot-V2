import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify accessibility of the contact form', async ({ page }) => {
    await page.goto(`${baseURL}/contact`);
    await expect(page).toHaveURL(/\/contact$/);
    const contactForm = page.locator('form[data-test="contact-form"]');
    await expect(contactForm).toBeVisible();
});
