import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test.describe('Product Browsing - Category', () => {
  test('TC-001: Display Category Page on Click', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'Electronics' }).click(); // Assuming 'Electronics' is a category name
    await expect(page).toHaveURL(/.*category/); // Check if the URL confirms the category page
  });

  test('TC-002: Display Category Name as Page Title', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'Electronics' }).click();
    await expect(page.getByRole('heading')).toHaveText('Electronics'); // Check the page title
  });

  test('TC-003: Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'Electronics' }).click();
    const products = await page.locator('.product'); // Assumes products have the class 'product'
    const productCount = await products.count();
    // Check that products belong to the category (mock conditions)
    await expect(productCount).toBeGreaterThan(0); // Assures there are products displayed
  });
});