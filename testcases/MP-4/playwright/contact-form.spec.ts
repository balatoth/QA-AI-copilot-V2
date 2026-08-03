import { test, expect } from '@playwright/test';

test('TC-001 - Verify accessibility of the contact form', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('https://v1.practicesoftwaretesting.com');

  // Click on the contact navigation link using a stable and unique selector
  const contactNav = page.locator('[data-test="nav-contact"]');
  await expect(contactNav).toBeVisible();
  await contactNav.click();

  // Verify that the contact form is visible on the page
  const contactForm = page.locator('form[data-test="contact-form"]');
  await expect(contactForm).toBeVisible();
});