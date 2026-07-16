import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test case: Display Product Detail Page
test('TC-001 - Display Product Detail Page', async ({ page }) => {
  await page.goto(baseUrl);
  // Assuming products are listed with a role of 'link'
  const productLink = page.getByRole('link').first();
  await productLink.click();
  await expect(page).toHaveURL(/.*product-detail/);
});

// Test case: Verify Product Details Displayed
test('TC-002 - Verify Product Details Displayed', async ({ page }) => {
  await page.goto(baseUrl);
  const productLink = page.getByRole('link').first();
  await productLink.click();
  await expect(page.getByRole('img')).toBeVisible(); // Product image
  await expect(page.getByText(/Product Name/i)).toBeVisible(); // Product name
  await expect(page.getByText(/Product Description/i)).toBeVisible(); // Product description
  await expect(page.getByText(/Price:/i)).toBeVisible(); // Product price
  await expect(page.getByText(/Category Badge/i)).toBeVisible(); // Category badge
  await expect(page.getByText(/Brand Badge/i)).toBeVisible(); // Brand badge
});

// Test case: Display Related Products Section
test('TC-003 - Display Related Products Section', async ({ page }) => {
  await page.goto(baseUrl);
  const productLink = page.getByRole('link').first();
  await productLink.click();
  const relatedProductsSection = page.getByText(/Related Products/i);
  await expect(relatedProductsSection).toBeVisible();
  const relatedProductLinks = relatedProductsSection.locator('a'); // Assuming related products are links
  await expect(relatedProductLinks).toHaveCountGreaterThan(0);
  await relatedProductLinks.first().click();
  await expect(page).toHaveURL(/.*product-detail/); // Verify navigation to related product detail page
});