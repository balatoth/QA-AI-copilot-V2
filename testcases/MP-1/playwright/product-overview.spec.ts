import { test, expect } from '@playwright/test';

const baseURL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
  await page.goto(baseURL);

  // Locate the product cards container explicitly by a stable data-test attribute
  const productCardsContainer = page.locator('[data-test="product-cards-container"]');
  await expect(productCardsContainer).toBeVisible();

  // Locate all product cards inside the container
  const productCards = productCardsContainer.locator('[data-test="product-card"]');

  // Assert that there is at least one product card
  await expect(productCards).toHaveCountGreaterThan(0);

  // For each product card, verify critical content elements
  const count = await productCards.count();
  for (let i = 0; i < count; i++) {
    const card = productCards.nth(i);
    await expect(card.locator('[data-test="product-image"]')).toBeVisible();
    await expect(card.locator('[data-test="product-name"]')).toBeVisible();
    await expect(card.locator('[data-test="product-price"]')).toBeVisible();
  }
});