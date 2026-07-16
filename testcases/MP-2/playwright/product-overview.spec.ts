import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test('TC-001: Display Product Detail Page', async ({ page }) => {
  await page.goto(baseURL);
  // Assume that products are listed with a role that can be located
  const productLink = page.getByRole('link', { name: /Product Name/i }); // Adjust selector as needed
  await productLink.click();
  await expect(page).toHaveURL(/.*product-detail/);
});

test('TC-002: Verify Product Details Displayed', async ({ page }) => {
  await page.goto(`${baseURL}product-detail`); // Navigate to a specific product detail
  await expect(page.getByRole('img')).toBeVisible(); // Product image
  await expect(page.getByRole('heading')).toBeVisible(); // Product name
  await expect(page.getByText(/description/i)).toBeVisible(); // Product description
  await expect(page.getByText(/price/i)).toBeVisible(); // Product price
  await expect(page.getByText(/category badge/i)).toBeVisible(); // Category badge
  await expect(page.getByText(/brand badge/i)).toBeVisible(); // Brand badge
});

test('TC-003: Display Related Products Section', async ({ page }) => {
  await page.goto(`${baseURL}product-detail`); // Navigate to a specific product detail
  await expect(page.getByRole('region', { name: /related products/i })).toBeVisible(); // Related products section
  const relatedProductLinks = page.locator('selector-for-related-products'); // Replace with an actual selector
  const count = await relatedProductLinks.count();
  expect(count).toBeGreaterThan(0); // At least one related product
  for (let i = 0; i < count; i++) {
    await relatedProductLinks.nth(i).click(); // Click each related product
    await expect(page).toHaveURL(/.*product-detail/); // Ensure it navigates to a detail page
    await page.goBack(); // Go back to the related products section
  }
});