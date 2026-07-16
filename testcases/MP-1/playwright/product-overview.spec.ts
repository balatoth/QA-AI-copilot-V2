import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// TC-001 - Verify grid of product cards is displayed on home page
test('TC-001: Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(BASE_URL);
  const productGrid = await page.locator('role=grid'); // Assuming a grid role is used
  await expect(productGrid).toBeVisible();
});

// TC-002 - Verify product card details are displayed
test('TC-002: Verify product card details are displayed', async ({ page }) => {
  await page.goto(BASE_URL);
  const productCards = await page.locator('.product-card'); // Placeholder class for product cards
  const firstCard = productCards.first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard.locator('img')).toBeVisible(); // Product image
  await expect(firstCard.locator('text=name')).toBeVisible(); // Product name
  await expect(firstCard.locator('text=price')).toBeVisible(); // Product price
});

// TC-003 - Verify navigation to product detail page from product card
test('TC-003: Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(BASE_URL);
  const firstProductCard = await page.locator('.product-card').first(); // Using placeholder class
await firstProductCard.click();
  await expect(page).toHaveURL(/product-detail/); // Assuming product detail follows a specific URL pattern
});