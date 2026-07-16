import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test.describe('Product Overview', () => {
  test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productGrid = await page.locator('[role="grid"]'); // Assuming grid has role attribute
    await expect(productGrid).toBeVisible();
  });

  test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCards = await page.locator('.product-card'); // Assuming product cards use this class
    await expect(productCards).toHaveCountGreaterThan(0);
    for (let i = 0; i < await productCards.count(); i++) {
      const image = productCards.nth(i).locator('img');
      const name = productCards.nth(i).locator('.product-name');
      const price = productCards.nth(i).locator('.product-price');
      await expect(image).toBeVisible();
      await expect(name).toBeVisible();
      await expect(price).toBeVisible();
    }
  });

  test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCard = await page.locator('.product-card').first(); // Selecting the first card for the sake of the test
    await expect(productCard).toBeVisible();
    await productCard.click();
    await expect(page).toHaveURL(/.*product-detail/); // Assuming detail pages contain 'product-detail' in their URL
  });
});