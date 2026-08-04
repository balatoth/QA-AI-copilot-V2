import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.locator('[data-test="product-1"]')).toBeVisible();
  await expect(page.locator('[data-test="product-2"]')).toBeVisible();
});

test('Navigation to Product Detail Page', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator('[data-test="product-1"]').click();
  // Assertion for the product detail page goes here, needs evidence
});
