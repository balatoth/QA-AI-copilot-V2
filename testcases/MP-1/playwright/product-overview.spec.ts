import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(BASE_URL);
  const productCards = page.locator('[data-test="product-1"]');
  await expect(productCards.first()).toBeVisible();
});