import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case TC-001: Verify grid of product cards is displayed on home page
test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  // Navigate to the home page.
  await page.goto(baseURL);
  // Verify a grid of product cards is displayed.
  const productGrid = page.locator('[role="grid"]'); // Using attribute selector for role
  await expect(productGrid).toBeVisible();
});

// Test Case TC-002: Verify product card details are displayed
test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  // Navigate to the home page.
  await page.goto(baseURL);
  // Observe the product cards displayed.
  const productCards = page.locator('[role="gridcell"]'); // Using attribute selector for role
  const count = await productCards.count();
  expect(count).toBeGreaterThan(0); // Ensure at least one product card
  for (let i = 0; i < count; i++) {
    const card = productCards.nth(i);
    const image = card.locator('img'); // Assuming each card contains an image
    await expect(image).toBeVisible();
    const name = card.locator('h2'); // Assuming each card contains a product name in an h2
    await expect(name).toBeVisible();
    const price = card.locator('.price'); // Assuming each card has a price element
    await expect(price).toBeVisible();
  }
});

// Test Case TC-003: Verify navigation to product detail page from product card
test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  // Navigate to the home page.
  await page.goto(baseURL);
  // Click on a product card.
  const firstProductCard = page.locator('[role="gridcell"]').first(); // Using attribute selector for role
  await firstProductCard.click();
  // Verify user is navigated to the product detail page.
  // Check URL contains expected path segment for product detail
  await expect(page).toHaveURL(/\/product\//);
  // Verify product detail heading is visible and more specific
  const productDetailHeading = page.locator('h1, h2').first(); // Prefer h1 or h2 as heading
  await expect(productDetailHeading).toBeVisible();
});