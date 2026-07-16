import { test, expect } from '@playwright/test';

test.describe('Product Browsing - Category Tests', () => {
  test('TC-001: Display Category Page on Click', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Category Name' }).click(); // Replace 'Category Name' with an actual category name
    await expect(page).toHaveURL(/.*category/); // Assumes URL structure includes 'category'
  });

  test('TC-002: Display Category Name as Page Title', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Category Name' }).click(); // Replace 'Category Name' with an actual category name
    await expect(page.title()).resolves.toBe('Category Name'); // Assumes title is the category name
  });

  test('TC-003: Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: 'Category Name' }).click(); // Replace 'Category Name' with an actual category name
    const products = await page.locator('.product'); // Assumes products have a class 'product'
    await expect(products).toHaveCount(3); // Adjust the count based on actual number of products expected
    // Additional validation can be added to verify product details
  });
});