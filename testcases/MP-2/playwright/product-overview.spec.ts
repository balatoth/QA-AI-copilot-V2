import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test case: Display Product Detail Page (TC-001)

test('TC-001: Display Product Detail Page', async ({ page }) => {
  await page.goto(baseUrl + '/overview'); // Navigating to the overview page
  await page.click('text=Product Name'); // Click on a product. Adjust the text to match the product.
  const productDetailHeader = await page.getByRole('heading', { name: /Product Detail/i });
  await expect(productDetailHeader).toBeVisible(); // Verify that the product detail page is displayed.
});

// Test case: Verify Product Details Displayed (TC-002)

test('TC-002: Verify Product Details Displayed', async ({ page }) => {
  await page.goto(baseUrl + '/product-detail'); // Adjust the URL as per the routing
  await expect(page.getByRole('img')).toBeVisible(); // Verify that the product image is displayed.
  await expect(page.getByRole('heading', { name: /Product Name/i })).toBeVisible(); // Verify the product name
  await expect(page.getByText(/Product Description/i)).toBeVisible(); // Verify product description
  await expect(page.getByText(/Price:/i)).toBeVisible(); // Verify product price
  await expect(page.getByText(/Category Badge/i)).toBeVisible(); // Verify category badge
  await expect(page.getByText(/Brand Badge/i)).toBeVisible(); // Verify brand badge
});

// Test case: Display Related Products Section (TC-003)

test('TC-003: Display Related Products Section', async ({ page }) => {
  await page.goto(baseUrl + '/product-detail'); // Adjust the URL as per the routing
  const relatedProductsSection = await page.getByRole('region', { name: /Related Products/i });
  await expect(relatedProductsSection).toBeVisible(); // Verify related products section is displayed

  const relatedProducts = await relatedProductsSection.locator('a'); // Assuming each related product is a link
  const count = await relatedProducts.count(); // Get the number of related products
  for (let i = 0; i < count; i++) {
    const productLink = relatedProducts.nth(i);
    await expect(productLink).toBeVisible(); // Ensure each related product is visible
    await productLink.click(); // Click on related product
    await expect(page.getByRole('heading', { name: /Product Detail/i })).toBeVisible(); // Check if navigated to its detail page
    await page.goBack(); // Go back to the previous page
    await expect(relatedProductsSection).toBeVisible(); // Ensure the related products section is still visible
  }
});