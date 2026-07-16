import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

test('TC-002 - Verify Required Fields in Contact Form', async ({ page }) => {
  await page.goto(baseUrl);
  const contactLink = page.getByRole('link', { name: 'Contact' });
  await contactLink.click();

  const requiredFields = await page.locator('input[required], textarea[required]'); // Selecting all required fields
  await expect(requiredFields).toHaveCount(3); // Adjust count based on actual required fields
});