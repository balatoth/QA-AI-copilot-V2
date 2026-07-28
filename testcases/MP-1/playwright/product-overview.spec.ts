import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    const productCards = await page.locator('[data-test="product-1"]').count();
    expect(productCards).toBeGreaterThan(0);
  });

  test('TC-002: Product Card Content Verification', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    const productCards = await page.locator('[data-test="product-1"]');
    const productName = await productCards.locator('[data-test="product-name"]').innerText();
    const productPrice = await productCards.locator('[data-test="product-price"]').innerText();

    expect(productName).not.toBe('');
    expect(productPrice).not.toBe('');
  });

  test('TC-003: Navigation to Product Detail Page', async ({ page }) => {
    await page.goto('https://v1.practicesoftwaretesting.com');
    await page.click('[data-test="product-1"]');
    await expect(page).toHaveURL(/product-detail/);
  });
});