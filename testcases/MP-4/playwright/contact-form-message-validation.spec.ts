import { test, expect } from '@playwright/test';

test('TC-004 - Verify Validation for Message Length', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const contactLink = await page.getByText('Contact');
  await contactLink.click();
  await page.fill('textarea[name="message"]', 'Short msg'); // Assuming it's a textarea
  await page.click('button[type="submit"]'); // Submit button
  const errorMessage = await page.getByText(/must be at least 50 characters/i);
  expect(errorMessage).toBeVisible();
});