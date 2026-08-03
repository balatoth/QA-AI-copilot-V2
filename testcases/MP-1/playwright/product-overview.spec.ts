import { test, expect } from '@playwright/test';

test('TC-001', async ({ page }) => {
  await page.goto('https://v1.practicesoftwaretesting.com');

  // Verify product grid container is visible
  const productGrid = page.locator('[data-testid="product-grid"]');
  await expect(productGrid).toBeVisible();

  // Verify each product card is visible using stable data-testid attributes
  for (let i = 1; i <= 5; i++) {
    const productCard = productGrid.locator(`[data-testid="product-${i}"]`);
    await expect(productCard).toBeVisible();
  }

  // Verify navigation home button is visible and navigates correctly
  const navHome = page.locator('[data-testid="nav-home"]');
  await expect(navHome).toBeVisible();

  // Click nav home and verify URL remains or navigates to home page
  await navHome.first().click();
  await expect(page).toHaveURL(/\/home|\/$/);
});