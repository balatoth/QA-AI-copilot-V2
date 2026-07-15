import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case TC-001: Verify grid of product cards is displayed on home page
test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(baseUrl);
  const productGrid = page.getByRole('grid');
  await expect(productGrid).toBeVisible(); // Check that the grid is displayed
});

// Test Case TC-002: Verify product card details are displayed
test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto(baseUrl);
  const productCards = page.getByRole('griditem');
  const count = await productCards.count();
  expect(count).toBeGreaterThan(0); // Ensure there are product cards
  for (let i = 0; i < count; i++) {
    const card = productCards.nth(i);
    const image = card.locator('img'); // Assuming product images are within <img> tags
    const name = card.getByRole('heading'); // Assuming product names are within <h*> tags
    const price = card.getByText(/\$\d+(?:\.\d{1,2})?/); // Assuming price is in the format $X.XX
    await expect(image).toBeVisible();
    const nameText = await name.innerText();
    expect(nameText.trim()).not.toBe(''); // Product name should not be empty
    const priceText = await price.innerText();
    expect(priceText.trim()).not.toBe(''); // Product price should not be empty
  }
});

// Test Case TC-003: Verify navigation to product detail page from product card
test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(baseUrl);
  const firstProductCard = page.getByRole('griditem').first(); // Selecting the first product card
  await firstProductCard.click(); // Click the product card
  const backLink = page.getByRole('link', { name: /back/i }); // Assuming there is a 'Back' link on product detail page
  await expect(backLink).toBeVisible(); // Ensure we are on the product detail page
  // Additional validation: check URL contains expected pattern
  await expect(page).toHaveURL(/\/product\//i);
});
