import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test("Display of Product Cards on Home Page", async ({ page }) => {
  await page.goto(baseUrl);
  const productCards = await page.locator('[data-test="product-1"]').count();
  expect(productCards).toBeGreaterThan(0);
});