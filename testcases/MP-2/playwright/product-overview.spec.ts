import { test, expect } from '@playwright/test';

test.describe('Product Detail Tests', () => {
  test('TC-001: Display Product Detail Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.click('text=Product 1'); // Assuming 'Product 1' is a clickable product title
    await expect(page).toHaveURL(/.*product-detail/); // Adjust based on actual URL structure
    await expect(page.locator('h1')).toHaveText('Product 1'); // Assuming product name is displayed in an h1
  });

  test('TC-002: Verify Product Details Displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail'); // Change to a valid product detail URL
    await expect(page.locator('img.product-image')).toBeVisible(); // Assuming a selector for product image
    await expect(page.locator('h1.product-name')).toBeVisible(); // Assuming a selector for product name
    await expect(page.locator('p.product-description')).toBeVisible(); // Assuming a selector for product description
    await expect(page.locator('.product-price')).toBeVisible(); // Assuming a selector for product price
    await expect(page.locator('.category-badge')).toBeVisible(); // Assuming a selector for category badge
    await expect(page.locator('.brand-badge')).toBeVisible(); // Assuming a selector for brand badge
  });

  test('TC-003: Display Related Products Section', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail'); // Change to a valid product detail URL
    await expect(page.locator('.related-products')).toBeVisible(); // Assuming a selector for related products section
    const relatedProducts = page.locator('.related-products .product-item'); // Adjust based on actual structure
    const count = await relatedProducts.count();
    expect(count).toBeGreaterThan(0); // Check that there are related products
    for (let i = 0; i < count; i++) {
      await relatedProducts.nth(i).click(); // Click on each related product
      await expect(page).toHaveURL(/.*product-detail/); // Check that it navigates to product detail
      await page.goBack(); // Navigate back to the previous page
    }
  });
});