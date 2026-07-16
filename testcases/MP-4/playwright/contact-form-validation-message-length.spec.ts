import { test, expect } from '@playwright/test';

test('TC-004 - Verify Validation for Message Length', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.fill('label:has-text("Message")', 'Short message'); // Assuming the message has a label
    await page.click('button[type="submit"]'); // Assuming a submit button exists
    const errorMessage = await page.getByText(/must be at least 50 characters/i);
    expect(errorMessage).toBeVisible();
});