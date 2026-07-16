import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'https://testsmith-io.github.io/practice-software-testing/#/';
const categoryName = 'Electronics'; // Replace with actual category name from the app
const categoryUrlFragment = 'electronics'; // URL fragment for the category page

// Test for displaying category page on click
test('TC-001: Display Category Page on Click', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole('link', { name: categoryName }).click();
  await expect(page).toHaveURL(new RegExp(`${categoryUrlFragment}`, 'i'));
  await expect(page.getByRole('heading', { name: categoryName })).toBeVisible();
});

// Test for displaying category name as page title
test('TC-002: Display Category Name as Page Title', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole('link', { name: categoryName }).click();
  await expect(page).toHaveTitle(new RegExp(categoryName, 'i'));
});

// Test for showing only relevant products on category page
test('TC-003: Show Only Relevant Products on Category Page', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole('link', { name: categoryName }).click();

  const products = page.locator('.product-item');
  const count = await products.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);
    await expect(product).toBeVisible();
    // Check that product has data-category attribute matching the categoryUrlFragment
    const dataCategory = await product.getAttribute('data-category');
    expect(dataCategory).toBeTruthy();
    expect(dataCategory?.toLowerCase()).toBe(categoryUrlFragment.toLowerCase());
  }
});
