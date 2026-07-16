import { test, expect } from '@playwright/test';

test.describe('Browse Products by Category', () => {
  test('TC-001 - Display Category Page on Click', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Category Name' }).click(); // Replace 'Category Name' with a real category name
    await expect(page).toHaveURL(/.*category/);
    await expect(page.getByRole('heading')).toHaveText('Category Name'); // Verify heading text
  });

  test('TC-002 - Display Category Name as Page Title', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Category Name' }).click(); // Replace 'Category Name' with a real category name
    await expect(page).toHaveTitle(/Category Name/); // Verify page title
  });

  test('TC-003 - Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Category Name' }).click(); // Replace 'Category Name' with a real category name
    const products = await page.locator('.product-item'); // Assuming products have a class 'product-item'
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0); // Expect at least one product
    // Further validation to check if products belong to the selected category can be added here
  });
});