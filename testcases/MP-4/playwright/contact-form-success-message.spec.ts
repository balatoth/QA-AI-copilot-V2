import { test, expect } from '@playwright/test';

test('TC-005 - Verify Confirmation Message upon Successful Submission', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.fill('label:has-text("Name")', 'John Doe');
    await page.fill('label:has-text("Email")', 'john.doe@example.com');
    await page.selectOption('label:has-text("Subject")', 'General Inquiry'); // Assuming the subject dropdown
    await page.fill('label:has-text("Message")', 'This is a valid message with more than fifty characters which is necessary for the validation to pass.');
    await page.click('button[type="submit"]');
    const confirmationMessage = await page.getByText(/successfully submitted/i);
    expect(confirmationMessage).toBeVisible();
});