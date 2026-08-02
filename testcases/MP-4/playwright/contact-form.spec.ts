import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Verify accessibility of the contact form', async ({ page }) => {
  await page.goto(`${BASE_URL}/contact`);
  const contactLink = page.locator('[data-test="nav-contact"]');
  await expect(contactLink).toBeVisible();
  await contactLink.click();
  const contactForm = page.locator('form[data-test="contact-form"]');
  await expect(contactForm).toBeVisible();
});