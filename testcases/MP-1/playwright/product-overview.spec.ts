import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test case TC-001: Verify grid of product cards is displayed on home page
test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(baseURL);
  const productGrid = await page.getByRole('grid'); // Assuming the product grid has a role attribute set to "grid"
  await expect(productGrid).toBeVisible();
});

// Test case TC-002: Verify product card details are displayed
test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto(baseURL);
  const productCards = await page.getByRole('listitem'); // Assuming each product card is an item in a list
  const firstProductCard = productCards.first();
  await expect(firstProductCard).toContainText(['image', 'name', 'price']); // Assuming these texts are present
});

// Test case TC-003: Verify navigation to product detail page from product card
test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(baseURL);
  const firstProductCard = await page.getByRole('listitem').first();
  await firstProductCard.click();
  await expect(page).toHaveURL(/product-detail/); // Assuming the product detail page URL contains "product-detail"
});