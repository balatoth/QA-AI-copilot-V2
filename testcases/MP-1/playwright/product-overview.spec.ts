import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productCards = await page.locator('div.product-card'); // Assuming product cards are in a div with class 'product-card'
    await expect(productCards).toHaveCountGreaterThan(0);
  });

  test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productCards = await page.locator('div.product-card');
    const firstProductCard = productCards.first();
    await expect(firstProductCard.locator('img')).toBeVisible(); // Assuming images are inside img tags
    await expect(firstProductCard.locator('h2')).toBeVisible(); // Assuming product name is in an h2 tag
    await expect(firstProductCard.locator('p.price')).toBeVisible(); // Assuming price is in a p tag with class 'price'
  });

  test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const firstProductCard = await page.locator('div.product-card').first();
    await firstProductCard.click();
    await expect(page).toHaveURL(/.*product-detail/); // Assuming product detail pages contain 'product-detail' in the URL
  });
});