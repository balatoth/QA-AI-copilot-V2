import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001 - Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(BASE_URL);
  const productCards = await page.locator('[data-test="product-1"]').count() +
    await page.locator('[data-test="product-2"]').count() +
    await page.locator('[data-test="product-3"]').count() +
    await page.locator('[data-test="product-4"]').count() +
    await page.locator('[data-test="product-5"]').count() +
    await page.locator('[data-test="product-6"]').count() +
    await page.locator('[data-test="product-7"]').count() +
    await page.locator('[data-test="product-8"]').count() +
    await page.locator('[data-test="product-9"]').count() +
    await page.locator('[data-test="product-10"]').count() +
    await page.locator('[data-test="product-11"]').count() +
    await page.locator('[data-test="product-12"]').count() +
    await page.locator('[data-test="product-13"]').count() +
    await page.locator('[data-test="product-14"]').count() +
    await page.locator('[data-test="product-15"]').count() +
    await page.locator('[data-test="product-16"]').count() +
    await page.locator('[data-test="product-17"]').count() +
    await page.locator('[data-test="product-18"]').count() +
    await page.locator('[data-test="product-19"]').count() +
    await page.locator('[data-test="product-20"]').count() +
    await page.locator('[data-test="product-21"]').count() +
    await page.locator('[data-test="product-22"]').count() +
    await page.locator('[data-test="product-23"]').count() +
    await page.locator('[data-test="product-24"]').count() +
    await page.locator('[data-test="product-25"]').count() +
    await page.locator('[data-test="product-26"]').count();

  expect(productCards).toBeGreaterThan(0);
});