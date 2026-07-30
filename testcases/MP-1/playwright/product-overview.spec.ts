import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(baseURL);
  const productGrid = await page.locator('[data-test="product-1"]').count();
  expect(productGrid).toBeGreaterThan(0);
});

test('Navigation to Product Detail Page', async ({ page }) => {
  await page.goto(baseURL);
  await page.click('[data-test="product-1"]');
  await expect(page).toHaveURL(/\/product\/1/);
});