import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify accessibility of the contact form', async ({ page }) => {
    await page.goto(`${baseUrl}/contact`);
    const contactForm = page.locator('form[data-test="contact-form"]');
    await expect(contactForm).toBeVisible();
    // Additional assertions to verify key elements within the contact form
    const nameInput = contactForm.locator('input[name="name"]');
    const emailInput = contactForm.locator('input[name="email"]');
    const messageTextarea = contactForm.locator('textarea[name="message"]');
    const submitButton = contactForm.locator('button[type="submit"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();
    await expect(submitButton).toBeVisible();
});