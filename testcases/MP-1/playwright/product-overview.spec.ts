import { test, expect } from '@playwright/test';

test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const productGrid = page.getByRole('grid'); // Assuming grid role is used for the product cards
  await expect(productGrid).toBeVisible();
});

test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const productCards = page.locator('.product-card'); // Assuming product cards have a class of 'product-card'
  await expect(productCards).toHaveCount(0); // In case of no products, use 0; adjust as needed
  await expect(productCards.first()).toContainText(['Image', 'Name', 'Price']); // Change to the respective text expected
});

test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const firstProductCard = page.locator('.product-card').first(); // Select the first product card
  await firstProductCard.click();
  await expect(page).toHaveURL(/.*product-detail/); // Assuming product detail URLs contain 'product-detail'
});