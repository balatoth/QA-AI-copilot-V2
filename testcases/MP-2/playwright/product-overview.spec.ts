import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test to display the product detail page when a product is clicked from the overview or category page.
test('TC-001 - Display Product Detail Page', async ({ page }) => {
  await page.goto(baseUrl);
  // Navigate to the overview or category page first, assuming the default page is the overview page.
  const productLink = await page.locator('text=Product Name'); // Replace with actual product name or locator
  await productLink.click();
  // Verify that the product detail page is displayed.
  const productDetail = await page.locator('h1'); // Assuming the product name is in an <h1> tag
  await expect(productDetail).toBeVisible();
});

// Test to verify that product details are displayed on the product detail page.
test('TC-002 - Verify Product Details Displayed', async ({ page }) => {
  await page.goto(baseUrl + 'product-detail'); // Replace with actual product detail URL
  // Verify each product detail element.
  await expect(page.locator('img[alt="Product Image"]')).toBeVisible(); // Assuming the product image has an alt attribute
  await expect(page.locator('h1')).toBeVisible(); // Product name
  await expect(page.locator('.product-description')).toBeVisible(); // Product description assumed from class
  await expect(page.locator('.product-price')).toBeVisible(); // Product price assumed from class
  await expect(page.locator('.category-badge')).toBeVisible(); // Category badge assumed from class
  await expect(page.locator('.brand-badge')).toBeVisible(); // Brand badge assumed from class
});

// Test to verify that the related products section is displayed below main product information.
test('TC-003 - Display Related Products Section', async ({ page }) => {
  await page.goto(baseUrl + 'product-detail'); // Replace with actual product detail URL
  // Check if related products section is visible.
  await expect(page.locator('.related-products')).toBeVisible(); // Assumed class for the related products section
  const relatedProducts = page.locator('.related-product-item'); // Assumed class for each related product item
  await expect(relatedProducts).toHaveCount(3); // Check for count, adjust based on expected number of related products
  await relatedProducts.first().click(); // Click on the first related product
  // Verify that the URL changes to the related product detail page.
  await expect(page).toHaveURL(/product-detail/); // assuming the related product leads to a URL with the pattern
});