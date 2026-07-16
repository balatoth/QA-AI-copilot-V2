import { test, expect } from '@playwright/test';

test('TC-004 - Verify Validation for Message Length', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  await page.fill('textarea[name="message"]', 'Short message'); // Assuming it's a textarea field
  await page.click('button[type="submit"]'); // Submit the form

  const errorMessage = await page.locator('.error-message'); // Assuming there's an element for error messages
  expect(await errorMessage.isVisible()).toBe(true);
  expect(await errorMessage.textContent()).toContain('must be at least 50 characters');
});