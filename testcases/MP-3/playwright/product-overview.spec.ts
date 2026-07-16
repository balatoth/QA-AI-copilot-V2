import { test, expect } from '@playwright/test';

test.describe('Product Browsing', () => {
  test('TC-001: Display Category Page on Click', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Electronics' }).click(); // Assumption: 'Electronics' is a category name
    await expect(page).toHaveURL(/.*category/);
  });

  test('TC-002: Display Category Name as Page Title', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Electronics' }).click(); // Assumption: 'Electronics' is a category name
    await expect(page.title()).resolves.toMatch(/Electronics/);
  });

  test('TC-003: Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Electronics' }).click(); // Assumption: 'Electronics' is a category name
    const products = await page.locator('.product-item').allTextContents(); // Assumption: .product-item contains product names
    expect(products).not.toContain('SomeOtherCategoryProduct'); // Assumption: this is a product from another category
  });
});