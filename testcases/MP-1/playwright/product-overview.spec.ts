import { test, expect } from '@playwright/test';

test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const productGrid = await page.getByRole('grid'); // Assuming the grid has a role of 'grid'
  expect(productGrid).toBeVisible();
});

test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const productCards = await page.locator('.product-card'); // Replace with an appropriate selector for product cards
  const count = await productCards.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const image = await productCards.nth(i).locator('img'); // Assuming each card has an <img> for the product image
    const name = await productCards.nth(i).locator('.product-name'); // Assuming the product name has a class 'product-name'
    const price = await productCards.nth(i).locator('.product-price'); // Assuming the product price has a class 'product-price'
    expect(image).toBeVisible();
    expect(name).toBeVisible();
    expect(price).toBeVisible();
  }
});

test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const firstProductCard = await page.locator('.product-card').first(); // Assuming the first product card can be selected this way
  await firstProductCard.click();
  expect(await page.url()).toMatch(/product-details/); // Adjust according to the actual URL structure for product details
});