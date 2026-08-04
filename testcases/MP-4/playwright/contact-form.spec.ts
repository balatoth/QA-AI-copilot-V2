import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify accessibility of the contact form', async ({ page }) => {
  await page.goto(baseURL);
  // Use a verified and robust selector for the contact navigation link
  const contactNav = page.locator('[data-test="nav-contact"]');
  await expect(contactNav).toBeVisible();
  await contactNav.click();

  // Use a verified selector for the contact form
  const contactForm = page.locator('form[data-test="contact-form"]');
  await expect(contactForm).toBeVisible();

  // Verify presence of essential form fields
  const nameField = contactForm.locator('input[name="name"]');
  const emailField = contactForm.locator('input[name="email"]');
  const messageField = contactForm.locator('textarea[name="message"]');

  await expect(nameField).toBeVisible();
  await expect(emailField).toBeVisible();
  await expect(messageField).toBeVisible();
});