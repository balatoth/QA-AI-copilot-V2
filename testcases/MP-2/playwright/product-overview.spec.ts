import { test, expect } from '@playwright/test';

test.describe('Product Detail Tests', () => {
  test('TC-001 - Display Product Detail Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    // Assume products are listed on the overview page and click the first product
    await page.getByRole('link', { name: 'First Product' }).click(); // Update this selector as needed
    await expect(page).toHaveURL(/.*product-detail/);
  });

  test('TC-002 - Verify Product Details Displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail');
    await expect(page.getByRole('img')).toBeVisible(); // Product image
    await expect(page.getByRole('heading')).toBeVisible(); // Product name
    await expect(page.getByText(/Description/i)).toBeVisible(); // Product description
    await expect(page.getByText(/Price/i)).toBeVisible(); // Product price
    await expect(page.getByText(/Category/i)).toBeVisible(); // Category badge
    await expect(page.getByText(/Brand/i)).toBeVisible(); // Brand badge
  });

  test('TC-003 - Display Related Products Section', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail');
    await expect(page.getByText(/Related Products/i)).toBeVisible(); // Related products section
    const relatedProducts = await page.locator('.related-products .product'); // Update this selector as needed
    const count = await relatedProducts.count();
    for (let i = 0; i < count; i++) {
      await expect(relatedProducts.nth(i)).toBeClickable();
      await relatedProducts.nth(i).click();
      await expect(page).toHaveURL(/.*product-detail/);
      await page.goBack(); // Navigate back to the previous page
      await expect(page).toHaveURL(/.*product-overview/); // Update this to the correct overview URL
    }
  });
});