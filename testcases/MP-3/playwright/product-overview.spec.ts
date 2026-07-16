import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test.describe('Product Browsing - Category Tests', () => {

  test('TC-001 - Display Category Page on Click', async ({ page }) => {
    await page.goto(baseURL);
    // Assuming categories are listed with role 'link'
    await page.getByRole('link', { name: 'Category Name' }).click();
    // Assuming the category page displays a header with role 'heading'
    expect(await page.getByRole('heading').innerText()).toContain('Category Name');
  });

  test('TC-002 - Display Category Name as Page Title', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Category Name' }).click();
    // Assuming the title of the page is displayed within a <title> tag
    const title = await page.title();
    expect(title).toBe('Category Name');
  });

  test('TC-003 - Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Category Name' }).click();
    // Assuming products belong to category and are displayed under 'product' role
    const products = await page.locator('[data-testid="product"]').allTextContents();
    // Assuming 'Product A' and 'Product B' belong to the category
    expect(products).toContain('Product A');
    expect(products).toContain('Product B');
    // Add more product assertions as needed
  });

});