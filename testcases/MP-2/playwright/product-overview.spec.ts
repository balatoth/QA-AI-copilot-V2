import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test('TC-001 - Display Product Detail Page', async ({ page }) => {
  await page.goto(BASE_URL);
  // Use page.getByRole to get the product link with a more specific name
  const productLink = page.getByRole('link', { name: /product name/i });
  await productLink.click();
  // Validate URL contains product-detail and some product identifier or validate page content
  await expect(page).toHaveURL(new RegExp(`${BASE_URL}product-detail`));
  // Additional content validation to ensure correct product detail page
  await expect(page.locator('h1[data-testid="product-name"]')).toBeVisible();
});

// Helper function to improve selector robustness
function getProductDetailSelectors() {
  return {
    image: 'img[data-testid="product-image"]',
    name: 'h1[data-testid="product-name"]',
    description: 'p[data-testid="product-description"]',
    price: 'span[data-testid="product-price"]',
    categoryBadge: 'span[data-testid="product-category"]',
    brandBadge: 'span[data-testid="product-brand"]'
  };
}

test('TC-002 - Verify Product Details Displayed', async ({ page }) => {
  await page.goto(`${BASE_URL}product-detail`);
  const selectors = getProductDetailSelectors();
  await expect(page.locator(selectors.image)).toBeVisible();
  await expect(page.locator(selectors.name)).toBeVisible();
  await expect(page.locator(selectors.description)).toBeVisible();
  await expect(page.locator(selectors.price)).toBeVisible();
  await expect(page.locator(selectors.categoryBadge)).toBeVisible();
  await expect(page.locator(selectors.brandBadge)).toBeVisible();
});

test('TC-003 - Display Related Products Section', async ({ page }) => {
  await page.goto(`${BASE_URL}product-detail`);
  const relatedSection = page.locator('section[data-testid="related-products"]');
  await expect(relatedSection).toBeVisible();
  const relatedProducts = relatedSection.locator('a[data-testid="related-product-link"]');
  const count = await relatedProducts.count();
  expect(count).toBeGreaterThan(0);
  await relatedProducts.first().click();
  await expect(page).toHaveURL(new RegExp(`${BASE_URL}product-detail`));
  // Validate that the new product detail page loaded
  await expect(page.locator('h1[data-testid="product-name"]')).toBeVisible();
});