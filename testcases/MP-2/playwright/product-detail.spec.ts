import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

// Test case for story MP-2
// Verifies that the Product Detail Page is displayed correctly when a product is selected

test('MP-2: Verify Product Detail Page is Displayed', async ({ page }) => {
  await page.goto(baseURL);

  // Wait for the product list to be visible
  const productLocator = page.locator('[data-test="product-1"]');
  await expect(productLocator).toBeVisible();

  // Click on the product
  await productLocator.click();

  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');

  // Assert that the URL contains '/product' indicating navigation to product detail page
  await expect(page).toHaveURL(/\/product/);

  // Additional assertion: check that a product detail element is visible
  const productDetail = page.locator('[data-test="product-detail"]');
  await expect(productDetail).toBeVisible();
});