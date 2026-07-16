import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test.describe('Product Browsing by Category', () => {
  test('TC-001 - Display Category Page on Click', async ({ page }) => {
    await page.goto(baseURL);
    // Assuming there's a role for category list items
    const categoryLink = page.getByRole('link', { name: 'Desired Category Name' }); // replace with an actual category name
    await categoryLink.click();
    await expect(page).toHaveURL(/category/); // Assuming categories have URLs containing the word 'category'
    await expect(page.locator('h1')).toBeVisible(); // Assuming the category name appears in an h1
  });

  test('TC-002 - Display Category Name as Page Title', async ({ page }) => {
    await page.goto(baseURL);
    const categoryLink = page.getByRole('link', { name: 'Desired Category Name' }); // replace with an actual category name
    await categoryLink.click();
    const categoryTitle = await page.locator('h1').innerText();
    await expect(categoryTitle).toBe('Desired Category Name'); // replace with the category name
  });

  test('TC-003 - Show Only Relevant Products on Category Page', async ({ page }) => {
    await page.goto(baseURL);
    const categoryLink = page.getByRole('link', { name: 'Desired Category Name' }); // replace with an actual category name
    await categoryLink.click();
    const products = page.locator('.product'); // Assuming '.product' is the class for product items
    const visibleProducts = await products.count();
    await expect(visibleProducts).toBeGreaterThan(0); // Ensure there are products displayed
    // Additional logic might be needed to verify products belong to the selected category, assumed already in the Products page
  });
});