import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case ID: TC-001
test('Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(baseUrl);
  const productGrid = await page.getByRole('grid'); // Assuming the product cards are in a grid role
  await expect(productGrid).toBeVisible();
});

// Test Case ID: TC-002
test('Verify product card details are displayed', async ({ page }) => {
  await page.goto(baseUrl);
  const productCards = await page.getByRole('griditem'); // Assuming each product card has a role of griditem
  const firstProductCard = productCards.nth(0);
  const image = await firstProductCard.getByRole('img'); // Assuming there is an image inside the card
  const name = await firstProductCard.getByText(/product name/i); // Replace with actual product name if known
  const price = await firstProductCard.getByText(/\$\d+\.\d+/); // Assuming price is in this format
  await expect(image).toBeVisible();
  await expect(name).toBeVisible();
  await expect(price).toBeVisible();
});

// Test Case ID: TC-003
test('Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(baseUrl);
  const productCards = await page.getByRole('griditem'); // Assuming each product card has a role of griditem
  const firstProductCard = productCards.nth(0);
  await firstProductCard.click();
  await expect(page).toHaveURL(/product-detail/); // Assuming the detail page contains 'product-detail' in its URL
});