import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test case TC-001: Verify grid of product cards is displayed on home page
 test('TC-001: Verify grid of product cards is displayed on home page', async ({ page }) => {
   await page.goto(baseURL);
   const grid = await page.getByRole('grid'); // Assuming the grid has role='grid'
   await expect(grid).toBeVisible();
 });

// Test case TC-002: Verify product card details are displayed
 test('TC-002: Verify product card details are displayed', async ({ page }) => {
   await page.goto(baseURL);
   const productCards = await page.getByRole('grid').locator('div'); // Adjust the locator for product cards
   const count = await productCards.count();

   for (let i = 0; i < count; i++) {
       const image = await productCards.nth(i).getByRole('img'); // Assuming product images have role='img'
       const name = await productCards.nth(i).getByText(/.+/); // Any text should be present for name
       const price = await productCards.nth(i).getByText(/\$\d+\.\d{2}/); // Assuming price format is like $00.00

       await expect(image).toBeVisible();
       await expect(name).toBeVisible();
       await expect(price).toBeVisible();
   }
 });

// Test case TC-003: Verify navigation to product detail page from product card
 test('TC-003: Verify navigation to product detail page from product card', async ({ page }) => {
   await page.goto(baseURL);
   const firstProductCard = await page.getByRole('grid').locator('div').first(); // Select the first product card
   await firstProductCard.click();
   await expect(page).toHaveURL(/\/product/); // Assuming product detail page URL contains '/product/'
 });