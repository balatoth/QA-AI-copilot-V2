import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify accessibility of the contact form', async ({ page }) => {
    await page.goto(`${baseURL}/contact`);
    const contactForm = page.locator('form#contactForm');
    await expect(contactForm).toBeVisible();
});