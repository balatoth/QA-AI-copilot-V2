import { test, expect } from '@playwright/test';

test('TC-001 - Verify Accessibility of Contact Form', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const contactForm = await page.getByRole('form', { name: /contact form/i }); // Assuming the form has a role of 'form' with an accessible name
  expect(contactForm).toBeVisible();
});