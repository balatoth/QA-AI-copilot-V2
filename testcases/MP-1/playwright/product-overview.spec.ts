import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productGrid = await page.getByRole('grid');
    await expect(productGrid).toBeVisible();
  });

  test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productCards = await page.locator('[data-testid="product-card"]'); // Assuming the product cards have a data-testid attribute
    const firstCard = productCards.nth(0);
    await expect(firstCard.getByRole('img')).toBeVisible(); // Product image
    await expect(firstCard.getByText(/\w+/)).toBeVisible(); // Product name
    await expect(firstCard.getByText(/\$\d+\.\d+/)).toBeVisible(); // Product price
  });

  test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const firstProductCard = await page.getByRole('grid').locator('[data-testid="product-card"]').nth(0);
    await firstProductCard.click();
    await expect(page).toHaveURL(/product-detail/); // Assumes product detail URL contains 'product-detail'
  });
});