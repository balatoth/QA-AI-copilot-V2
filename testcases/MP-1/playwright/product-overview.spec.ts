import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productGrid = page.locator('role=grid'); // Assuming the product grid is represented semantically as a grid
    await expect(productGrid).toBeVisible();
  });

  test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productCards = page.locator('.product-card'); // Change to a more specific locator if necessary
    await expect(productCards).toHaveCount(1); // Adjust count accordingly; ensure it's more than zero
    for (let card of await productCards.elementHandles()) {
      const image = card.locator('img');
      const name = card.locator('h2');
      const price = card.locator('.price'); // Adjust to the actual selector
      await expect(image).toBeVisible();
      await expect(name).toBeVisible();
      await expect(price).toBeVisible();
    }
  });

  test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productCard = page.locator('.product-card').first(); // Adjust based on the actual locator
    await productCard.click();
    await expect(page).toHaveURL(/\/product-detail/); // Assuming the URL contains /product-detail/
  });
});