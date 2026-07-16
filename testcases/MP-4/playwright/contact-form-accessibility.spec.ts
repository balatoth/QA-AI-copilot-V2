import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

test('TC-001 - Verify Accessibility of Contact Form', async ({ page }) => {
  await page.goto(baseUrl);
  const contactLink = page.getByRole('link', { name: 'Contact' }); // Assuming there's a link to contact page
  await contactLink.click();
  const contactForm = await page.getByRole('form', { name: 'Contact Form' }); // Assuming the form has an accessible name
  await expect(contactForm).toBeVisible();
});