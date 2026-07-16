import { test, expect } from '@playwright/test';

test('TC-001 - Verify Accessibility of Contact Form', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const contactForm = await page.getByRole('form', { name: 'Contact Form' }); // Assuming the form has an accessible name
    expect(contactForm).toBeVisible();
});