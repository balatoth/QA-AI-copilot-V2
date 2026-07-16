import { test, expect } from '@playwright/test';

test('TC-001 - Verify Accessibility of Contact Form', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const contactLink = await page.getByText('Contact'); // Assuming there's a link to the contact page
  await contactLink.click();
  const contactForm = await page.getByRole('form');
  expect(contactForm).toBeVisible();
});