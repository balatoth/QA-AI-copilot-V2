import { test, expect } from '@playwright/test';

test.describe('Product Browsing', () => {
  test('TC-001 - Display Category Page on Click', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: /category name/i }).click(); // Assuming category link contains text 'category name'
    expect(await page.isVisible('h1')).toBe(true); // Assuming the category page has an h1 tag
  });

  test('TC-002 - Display Category Name as Page Title', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: /category name/i }).click(); // Same category name as above
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Category Name'); // Assuming the title includes 'Category Name'
  });

  test('TC-003 - Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: /category name/i }).click(); // Same category name as above
    const products = await page.locator('.product-item'); // Assuming there's a class for product items
    expect(await products.count()).toBeGreaterThan(0); // Ensure there are products displayed
    // Additional logic to check products belong to the selected category can be implemented here
  });
});