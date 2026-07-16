import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case TC-001: Verify grid of product cards is displayed on home page
test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(BASE_URL);
  const productGrid = await page.getByRole('grid'); // Assuming product cards are in a grid role
  await expect(productGrid).toBeVisible();
});

// Test Case TC-002: Verify product card details are displayed
test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto(BASE_URL);
  const productCards = await page.getByRole('gridcell'); // Assuming product cards are represented as grid cells
  const cardsCount = await productCards.count();
  for (let i = 0; i < cardsCount; i++) {
    const card = productCards.nth(i);
    await expect(card.locator('img')).toBeVisible(); // Assuming product image is an <img> tag
    await expect(card.locator('text=name')).toBeVisible(); // Placeholder for product name locator
    await expect(card.locator('text=price')).toBeVisible(); // Placeholder for product price locator
  }
});

// Test Case TC-003: Verify navigation to product detail page from product card
test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(BASE_URL);
  const firstProductCard = await page.getByRole('gridcell').nth(0);
  await firstProductCard.click();
  await expect(page).toHaveURL(/.*product-detail/); // Adjust this based on the actual URL pattern
});