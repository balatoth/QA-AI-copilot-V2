import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case: TC-001 - Display Category Page on Click
test('TC-001 - Display Category Page on Click', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('role=link[name="Electronics"]').click(); // Assuming category link is labeled 'Electronics'
  await expect(page).toHaveURL(/\/category\/electronics/);
  await expect(page.locator('h1')).toHaveText('Electronics');
});

// Test Case: TC-002 - Display Category Name as Page Title
test('TC-002 - Display Category Name as Page Title', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('role=link[name="Electronics"]').click(); // Assuming category link is labeled 'Electronics'
  await expect(page.title()).toBe('Electronics');
});

// Test Case: TC-003 - Show Only Relevant Products on Category Page
test('TC-003 - Show Only Relevant Products on Category Page', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('role=link[name="Electronics"]').click(); // Assuming category link is labeled 'Electronics'
  const products = await page.locator('.product-item'); // Assuming each product has class 'product-item'
  await expect(products).toHaveCount(4); // Assuming there are 4 products in this category
});
