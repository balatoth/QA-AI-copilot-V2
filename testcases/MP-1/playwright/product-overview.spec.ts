import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test case TC-001: Verify grid of product cards is displayed on home page
test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(baseUrl);
  const productGrid = await page.getByRole('grid'); // Assuming the grid has a role of 'grid'
  await expect(productGrid).toBeVisible();
});

// Test case TC-002: Verify product card details are displayed
test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto(baseUrl);
  const productCards = await page.getByRole('grid').locator('div'); // Locate product card elements inside the grid
  const productCount = await productCards.count();
  for (let i = 0; i < productCount; i++) {
    const card = productCards.nth(i);
    const image = card.locator('img'); // Assuming product image is an <img> element
    const name = card.getByText(/Product Name/i); // Assuming product name is text-based
    const price = card.getByText(/\$\d+.\d+/); // Assuming price is in a specific format
    await expect(image).toBeVisible();
    await expect(name).toBeVisible();
    await expect(price).toBeVisible();
  }
});

// Test case TC-003: Verify navigation to product detail page from product card
test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(baseUrl);
  const firstProductCard = await page.getByRole('grid').locator('div').first();
  await firstProductCard.click();
  await expect(page).toHaveURL(/\/product-details/); // Assuming product detail page redirects with this pattern
});