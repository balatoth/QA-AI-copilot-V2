import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test case TC-001: Display Product Detail Page
test('TC-001 - Display Product Detail Page', async ({ page }) => {
  await page.goto(baseUrl);
  // Assuming that products have a role of 'button' or similar on the overview page.
  const productButton = page.getByRole('button', { name: /product name/i }); // Replace with actual product name or selector
  await productButton.click();
  await expect(page).toHaveURL(/.*product-detail/); // Verify navigation to detail page
});

// Test case TC-002: Verify Product Details Displayed
test('TC-002 - Verify Product Details Displayed', async ({ page }) => {
  await page.goto(baseUrl + 'product-detail');
  await expect(page.getByRole('img')).toBeVisible(); // Product image
  await expect(page.getByRole('heading')).toBeVisible(); // Product name
  await expect(page.getByText(/description/i)).toBeVisible(); // Product description
  await expect(page.getByText(/price/i)).toBeVisible(); // Product price
  await expect(page.getByText(/category badge/i)).toBeVisible(); // Category badge
  await expect(page.getByText(/brand badge/i)).toBeVisible(); // Brand badge
});

// Test case TC-003: Display Related Products Section
test('TC-003 - Display Related Products Section', async ({ page }) => {
  await page.goto(baseUrl + 'product-detail');
  await expect(page.getByText(/related products/i)).toBeVisible(); // Assuming there's a title for the related products section
  const relatedProduct = page.getByRole('link', { name: /related product name/i }); // Replace with actual related product name or selector
  await expect(relatedProduct).toBeVisible(); // Each related product should be visible
  await relatedProduct.click();
  await expect(page).toHaveURL(/.*related-product-detail/); // Verify navigation to related product detail page
});