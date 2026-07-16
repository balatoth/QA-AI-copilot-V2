import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case TC-001: Verify grid of product cards is displayed on home page
test('TC-001: Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(BASE_URL);
  const productGrid = await page.getByRole('grid'); // Assuming grid role is available
  await expect(productGrid).toBeVisible();
});

// Test Case TC-002: Verify product card details are displayed
test('TC-002: Verify product card details are displayed', async ({ page }) => {
  await page.goto(BASE_URL);
  const productCards = page.locator('.product-card'); // Assuming each product card has a common class
  await expect(productCards).toHaveCountGreaterThan(0);
  const firstProductCard = productCards.first();
  await expect(firstProductCard.locator('img')).toBeVisible(); // Image should be visible
  await expect(firstProductCard.locator('h2')).toBeVisible(); // Product name should be visible
  await expect(firstProductCard.locator('.price')).toBeVisible(); // Price should be visible
});

// Test Case TC-003: Verify navigation to product detail page from product card
test('TC-003: Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(BASE_URL);
  const firstProductCard = page.locator('.product-card').first(); // Assuming each product card has a common class
  await firstProductCard.click();
  await expect(page).toHaveURL(/product-detail/); // Assuming product detail URLs contain '/product-detail/' keyword
});
