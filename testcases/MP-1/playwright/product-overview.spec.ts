import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test('TC-001 - Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(BASE_URL);
  const productGrid = await page.locator('role=grid'); // Assuming grid role for product display
  await expect(productGrid).toBeVisible();
});

test('TC-002 - Product Card Content Verification', async ({ page }) => {
  await page.goto(BASE_URL);
  const productCards = await page.locator('role=griditem'); // Assuming individual card role
  const count = await productCards.count();
  for (let i = 0; i < count; i++) {
    const card = productCards.nth(i);
    await expect(card.locator('img')).toBeVisible(); // Verify product image
    await expect(card.locator('text=name')).toBeVisible(); // Replace 'name' with actual product name locator
    await expect(card.locator('text=price')).toBeVisible(); // Replace 'price' with actual product price locator
  }
});

test('TC-003 - Navigation to Product Detail Page', async ({ page }) => {
  await page.goto(BASE_URL);
  const firstProductCard = await page.locator('role=griditem').first();
  await firstProductCard.click();
  await expect(page).toHaveURL(/\/product-detail/); // Assuming product detail URL pattern
});