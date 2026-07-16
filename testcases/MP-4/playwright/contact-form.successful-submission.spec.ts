import { test, expect } from '@playwright/test';

test('TC-005 - Verify Confirmation Message upon Successful Submission', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="email"]', 'john.doe@example.com');
  await page.fill('textarea[name="message"]', 'This is a valid message with sufficient length.');
  await page.click('button[type="submit"]');

  const confirmationMessage = await page.locator('.confirmation-message'); // Assuming there's an element for confirmation messages
  expect(await confirmationMessage.isVisible()).toBe(true);
  expect(await confirmationMessage.textContent()).toContain('Thank you for your message');
});