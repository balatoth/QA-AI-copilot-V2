import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

test('TC-004 - Verify Validation for Message Length', async ({ page }) => {
  await page.goto(baseUrl);
  const contactLink = page.getByRole('link', { name: 'Contact' });
  await contactLink.click();

  await page.fill('textarea[name="message"]', 'Short msg'); // Adjust selector as necessary
  await page.click('button[type="submit"]'); // Assuming there's a submit button
  const errorMessage = await page.getByText(/message must be at least 50 characters/i);
  await expect(errorMessage).toBeVisible();
});