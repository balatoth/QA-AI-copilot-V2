import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test('TC-001 - Verify accessibility of the contact form', async ({ page }) => {
  await page.goto(`${baseUrl}/contact`);
  await expect(page.locator('[data-test="nav-contact"]')).toBeVisible();
});