import { test, expect } from '@playwright/test';

test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const productGrid = await page.getByRole('grid'); // Assuming grid is defined by role
  await expect(productGrid).toBeVisible();
});

test('TC-002 - Verify product card details are displayed', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const productCards = await page.locator('.product-card'); // Assuming a class for product cards exists
  const cardCount = await productCards.count();
  await expect(cardCount).toBeGreaterThan(0);
  for (let i = 0; i < cardCount; i++) {
    const image = productCards.nth(i).locator('img'); // Assuming image is an img element inside each card
    const name = productCards.nth(i).getByRole('heading'); // Assuming the name is represented as a heading
    const price = productCards.nth(i).getByText(/\$[0-9]+\.[0-9]{2}/); // Assuming price is formatted as currency

    await expect(image).toBeVisible();
    await expect(name).toBeVisible();
    await expect(price).toBeVisible();
  }
});

test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const firstProductCard = await page.locator('.product-card').first(); // Assuming a class for product cards exists
  await firstProductCard.click();
  await expect(page).toHaveURL(/.*product-detail/); // Assuming the product detail page URL contains 'product-detail'
});