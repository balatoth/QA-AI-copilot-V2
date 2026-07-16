import { test, expect } from '@playwright/test';

test('TC-002 - Verify Required Fields in Contact Form', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const contactLink = await page.getByText('Contact');
  await contactLink.click();
  const requiredFields = await page.getByRole('textbox', { name: /name/i }); // Example field
  expect(requiredFields).toBeVisible();
  // Add checks for all required fields
});