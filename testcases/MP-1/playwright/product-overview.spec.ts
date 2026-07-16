import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productGrid = await page.getByRole('grid'); // Assuming the grid has a role of 'grid'
    await expect(productGrid).toBeVisible();
  });

  test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productCards = await page.locator('[data-testid="product-card"]'); // Assuming each product card has a test ID of 'product-card'
    const count = await productCards.count();
    await expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const productCard = productCards.nth(i);
      await expect(productCard.locator('img')).toBeVisible(); // Expect image to be visible
      await expect(productCard.locator('.product-name')).toBeVisible(); // Expect product name to be visible
      await expect(productCard.locator('.product-price')).toBeVisible(); // Expect price to be visible
    }
  });

  test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const firstProductCard = await page.locator('[data-testid="product-card"]').first();
    const productName = await firstProductCard.locator('.product-name').innerText();
    await firstProductCard.click();

    const heading = await page.getByRole('heading', { name: productName }); // Assuming the product detail page has a heading with product name
    await expect(heading).toBeVisible();
  });
});