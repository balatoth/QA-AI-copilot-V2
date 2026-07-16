import { test, expect } from '@playwright/test';

test.describe('Product Detail Tests', () => {
  test('TC-001: Display Product Detail Page', async ({ page }) => {
    // Navigate to the overview page
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    // Click on a product (assumed to be the first product available)
    await page.getByRole('link', { name: /product/i }).click();
    // Verify that the product detail page is displayed
    await expect(page).toHaveURL(/detail/);
  });

  test('TC-002: Verify Product Details Displayed', async ({ page }) => {
    // Navigate to the product detail page directly (assumed URL for example)
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail');
    // Verify product details are displayed
await expect(page.getByRole('img')).toBeVisible();
    await expect(page.getByRole('heading', { name: /product name/i })).toBeVisible();
    await expect(page.getByText(/description/i)).toBeVisible();
    await expect(page.getByText(/price/i)).toBeVisible();
    await expect(page.getByText(/category badge/i)).toBeVisible();
    await expect(page.getByText(/brand badge/i)).toBeVisible();
  });

  test('TC-003: Display Related Products Section', async ({ page }) => {
    // Navigate to the product detail page directly (assumed URL for example)
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail');
    // Verify related products section is displayed
    await expect(page.getByRole('heading', { name: /related products/i })).toBeVisible();
    const relatedProducts = await page.getByRole('link', { name: /related product/i });
    await expect(relatedProducts).toBeVisible();
    await relatedProducts.click();
    // Verify navigation to related product detail page
    await expect(page).toHaveURL(/related-detail/);
  });
});