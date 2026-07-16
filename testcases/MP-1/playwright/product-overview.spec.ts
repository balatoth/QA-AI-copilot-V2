import { test, expect } from '@playwright/test';

test.describe('Product Overview', () => {
  test('TC-001: Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productGrid = await page.getByRole('grid');
    await expect(productGrid).toBeVisible();
  });

  test('TC-002: Verify product card details are displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const productCards = await page.locator('[role="grid"] [role="article"]'); // Assumption: Each product card is an article within a grid.
    const count = await productCards.count();
    await expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const image = await productCards.nth(i).getByRole('img');
      const name = await productCards.nth(i).getByRole('heading');
      const price = await productCards.nth(i).getByText(/\$[\d,]+\.\d{2}/); // Assuming price is presented in a dollar format.

      await expect(image).toBeVisible();
      await expect(name).toBeVisible();
      await expect(price).toBeVisible();
    }
  });

  test('TC-003: Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const firstProductCard = await page.locator('[role="grid"] [role="article"]').first();
    const productName = await firstProductCard.getByRole('heading').innerText();
    await firstProductCard.click();
    await expect(page).toHaveURL(/.*\/product\/.*$/); // Assumption: Product detail page contains 'product' in URL.
    await expect(page.getByText(productName)).toBeVisible();
  });
});