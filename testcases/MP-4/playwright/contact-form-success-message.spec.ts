import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

test('TC-005 - Verify Confirmation Message upon Successful Submission', async ({ page }) => {
  await page.goto(baseUrl);
  const contactLink = page.getByRole('link', { name: 'Contact' });
  await contactLink.click();

  await page.fill('input[name="name"]', 'John Doe'); // Adjust selector as necessary
  await page.fill('input[name="email"]', 'john.doe@example.com'); // Adjust selector as necessary
  await page.fill('textarea[name="message"]', 'This is a valid message with more than 50 characters.');
  await page.click('button[type="submit"]');

  const confirmationMessage = await page.getByText(/thank you for your message/i);
  await expect(confirmationMessage).toBeVisible();
});