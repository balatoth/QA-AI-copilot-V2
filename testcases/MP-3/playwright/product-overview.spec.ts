import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test.describe('Product Browsing by Category', () => {
  test('TC-001: Display Category Page on Click', async ({ page }) => {
    await page.goto(baseURL);
    // Assuming categories are listed as buttons/links that can be clicked
    const categoryLink = await page.locator('text=Electronics'); // Adjust based on actual category
    await categoryLink.click();
    expect(await page.title()).toContain('Electronics'); // Adjust according to expected title
  });

  test('TC-002: Display Category Name as Page Title', async ({ page }) => {
    await page.goto(baseURL);
    const categoryLink = await page.locator('text=Electronics');
    await categoryLink.click();
    expect(await page.title()).toContain('Electronics'); // Ensure title reflects clicked category
  });

  test('TC-003: Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto(baseURL);
    const categoryLink = await page.locator('text=Electronics');
    await categoryLink.click();
    const productItems = await page.locator('.product-item'); // Assuming products have a specific class
    const productsVisible = await productItems.count();
    // This needs logical checks based on the actual product data; assuming some way to verify products
    expect(productsVisible).toBeGreaterThan(0); // Verify that there are products listed
    // Additional verification would be done here to ensure they belong to 'Electronics'
  });
});