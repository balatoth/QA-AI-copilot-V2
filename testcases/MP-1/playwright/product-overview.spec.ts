import { test, expect } from '@playwright/test';

const baseUrl = 'https://practicesoftwaretesting.com/';

// Test Case TC-001
test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto(baseUrl);
  const productGrid = await page.locator('role=grid'); // Assuming the grid has a role of 'grid'
  await expect(productGrid).toBeVisible();
});

// Test Case TC-002
test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto(baseUrl);
  const productCards = await page.locator('.product-card'); // Assuming product cards have a class of 'product-card'
  await expect(productCards).toHaveCountGreaterThan(0);
  for (let i = 0; i < await productCards.count(); i++) {
    const image = await productCards.nth(i).locator('img'); // Assuming images are inside <img> tags
    const name = await productCards.nth(i).locator('text=Product Name'); // Replace with actual product name locator
    const price = await productCards.nth(i).locator('text=$'); // Assuming price starts with a dollar sign '$'
    await expect(image).toBeVisible();
    await expect(name).toBeVisible();
    await expect(price).toBeVisible();
  }
});

// Test Case TC-003
test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto(baseUrl);
  const firstProductCard = await page.locator('.product-card').first(); // Assuming product cards have a class of 'product-card'
  await firstProductCard.click();
  await expect(page).toHaveURL(/product-detail/); // Assuming product detail pages contain 'product-detail' in the URL
});
