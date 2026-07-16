import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case TC-001: Display Product Detail Page
test('TC-001: Display Product Detail Page', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole('link', { name: /product name/i }).click(); // Assuming 'product name' is visible as a link.
  await expect(page).toHaveURL(/product-detail/); // Update with actual URL pattern for product detail.
});

// Test Case TC-002: Verify Product Details Displayed
test('TC-002: Verify Product Details Displayed', async ({ page }) => {
  await page.goto(baseUrl + '/product-detail');
  await expect(page.getByRole('img')).toBeVisible(); // Product image
  await expect(page.getByRole('heading')).toBeVisible(); // Product name
  await expect(page.getByText(/product description/i)).toBeVisible(); // Product description
  await expect(page.getByText(/\$\d+\.\d+/)).toBeVisible(); // Product price pattern
  await expect(page.getByText(/category badge/i)).toBeVisible(); // Category badge
  await expect(page.getByText(/brand badge/i)).toBeVisible(); // Brand badge
});

// Test Case TC-003: Display Related Products Section
test('TC-003: Display Related Products Section', async ({ page }) => {
  await page.goto(baseUrl + '/product-detail');
  await expect(page.getByText(/related products/i)).toBeVisible(); // Assuming there's a header or text for related products
  const relatedProducts = await page.locator('.related-products .product'); // Example locator for related products, replace with a stable one
  const count = await relatedProducts.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await relatedProducts.nth(i).click(); // Click each related product
    await expect(page).toHaveURL(/product-detail/); // Ensure it navigates to product detail
    await page.goBack(); // Go back to the previous page
  }
});