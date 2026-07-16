import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case TC-001: Verify grid of product cards is displayed on home page
test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(baseURL);
  const productGrid = await page.getByRole('grid'); // Assuming grid role for product cards
  await expect(productGrid).toBeVisible();
});

// Test Case TC-002: Verify product card details are displayed
test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto(baseURL);
  const productCards = await page.getByRole('grid').locator('div'); // Assuming each card is a div inside the grid
  const cardsCount = await productCards.count();

  for (let i = 0; i < cardsCount; i++) {
    const productImage = productCards.nth(i).getByRole('img'); // Assuming product image is an img role
    const productName = productCards.nth(i).getByText(/.*/); // Assuming product name as any visible text
    const productPrice = productCards.nth(i).getByText(/\$\d+\.\d+/); // Assuming price format

    await expect(productImage).toBeVisible();
    await expect(productName).toBeVisible();
    await expect(productPrice).toBeVisible();
  }
});

// Test Case TC-003: Verify navigation to product detail page from product card
test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(baseURL);
  const firstProductCard = await page.getByRole('grid').locator('div').first(); // Selecting the first product card
  await firstProductCard.click();
  await expect(page).toHaveURL(/\/product-detail/); // Assuming product detail page URL contains '/product-detail/' pattern
});