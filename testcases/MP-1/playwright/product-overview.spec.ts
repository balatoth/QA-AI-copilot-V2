import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(BASE_URL);
  // Verify the home navigation link is visible
  await expect(page.locator('[data-test="nav-home"]')).toBeVisible();

  // Verify the product grid container is visible
  const productGrid = page.locator('[data-test="product-grid"]');
  await expect(productGrid).toBeVisible();

  // Verify that at least one product card is visible inside the product grid
  const productCards = productGrid.locator('[data-test="product-card"]');
  await expect(productCards.first()).toBeVisible();

  // Optionally, verify the count of product cards is greater than zero
  const count = await productCards.count();
  expect(count).toBeGreaterThan(0);
});