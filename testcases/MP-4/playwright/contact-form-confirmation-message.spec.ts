import { test, expect } from '@playwright/test';

test('TC-005 - Verify Confirmation Message upon Successful Submission', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const contactLink = await page.getByText('Contact');
  await contactLink.click();
  await page.fill('input[name="name"]', 'John Doe'); // Example for name field
  await page.fill('input[name="email"]', 'john.doe@example.com'); // Example for email field
  await page.fill('textarea[name="message"]', 'This is a valid message that is longer than fifty characters.');
  await page.click('button[type="submit"]');
  const confirmationMessage = await page.getByText(/thank you/i);
  expect(confirmationMessage).toBeVisible();
});