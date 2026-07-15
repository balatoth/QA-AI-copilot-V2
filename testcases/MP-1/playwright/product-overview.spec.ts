import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productGrid = page.getByRole('grid'); // Assuming a grid role is used for the product grid
    await expect(productGrid).toBeVisible();
  });

  test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productCards = page.locator('.product-card'); // Assuming each product card has a class of 'product-card'
    await expect(productCards).toHaveCountGreaterThan(0);

    for (let i = 0; i < await productCards.count(); i++) {
      const card = productCards.nth(i);
      await expect(card.locator('img')).toBeVisible(); // Assuming each card has an image
      await expect(card.locator('.product-name')).toBeVisible(); // Assuming product name has a class
      await expect(card.locator('.product-price')).toBeVisible(); // Assuming product price has a class
    }
  });

  test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const firstProductCard = page.locator('.product-card').nth(0); // Selecting the first product card
    await firstProductCard.click();
    await expect(page).toHaveURL(/.*product-detail/); // Assuming product detail page contains 'product-detail' in URL
  });
});