import { test, expect } from '@playwright/test';

// Define a constant for the category name to improve maintainability and selector quality
const CATEGORY_NAME = 'Electronics';
const CATEGORY_URL_FRAGMENT = 'electronics';

// Use data-testid attributes or more specific selectors if available; here we simulate with exact text matching

test.describe('Product Browsing', () => {
  test('TC-001 - Display Category Page on Click', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    // Click on the category link with exact name
    await page.getByRole('link', { name: CATEGORY_NAME }).click();
    // Validate URL contains expected category fragment
    await expect(page).toHaveURL(new RegExp(`.*#/${CATEGORY_URL_FRAGMENT}$`));
    // Validate the heading with exact category name is visible
    await expect(page.getByRole('heading', { name: CATEGORY_NAME })).toBeVisible();
  });

  test('TC-002 - Display Category Name as Page Title', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: CATEGORY_NAME }).click();
    // Await the asynchronous assertion properly
    await expect(page.title()).resolves.toMatch(new RegExp(CATEGORY_NAME, 'i'));
  });

  test('TC-003 - Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: CATEGORY_NAME }).click();

    // Locator for products - assuming products have data-testid="product-item" attribute
    const products = page.locator('[data-testid="product-item"]');

    // Wait for products to be visible
    await expect(products).toHaveCount(5); // Replace 5 with the expected number of products for the category

    // Verify each product contains the category name in its text content
    const count = await products.count();
    for (let i = 0; i < count; i++) {
      const productText = await products.nth(i).textContent();
      expect(productText).toMatch(new RegExp(CATEGORY_NAME, 'i'));
    }
  });
});
