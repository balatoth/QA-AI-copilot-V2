import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(baseUrl);

  // Verify grid of product cards is displayed
  const productCards = await page.locator('[data-test="product-1"]').count();
  expect(productCards).toBeGreaterThan(0);
});

test('TC-002: Product Card Content Verification', async ({ page }) => {
  await page.goto(baseUrl);

  // Obtain all product cards count and verify content
  const productCardCount = await page.locator('[data-test^="product-"]').count();
  for (let i = 1; i <= productCardCount; i++) {
    const productName = await page.locator(`[data-test="product-${i}"] [data-test="product-name"]`).textContent();
    const productPrice = await page.locator(`[data-test="product-${i}"] [data-test="product-price"]`).textContent();
    expect(productName).toBeTruthy();
    expect(productPrice).toBeTruthy();
  }
});

test('TC-003: Navigation to Product Detail Page', async ({ page }) => {
  await page.goto(baseUrl);

  const productLink = page.locator('[data-test="product-1"]');
  await productLink.click();

  // Verify the product detail page is displayed (you can confirm via URL or other elements in detail page)
  expect(page.url()).toContain('/product-1'); // This assumes a pattern in the URL that has the product id
});
