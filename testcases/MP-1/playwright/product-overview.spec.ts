import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test case for TC-001: Verify grid of product cards is displayed on home page

test('TC-001 - Verify grid of product cards is displayed on home page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productGrid = page.locator('[data-testid="product-grid"]'); // Using data-testid for more reliable selector
    await expect(productGrid).toBeVisible();
});

// Test case for TC-002: Verify product card details are displayed

test('TC-002 - Verify product card details are displayed', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCards = page.locator('[data-testid="product-card"]'); // Using data-testid for product cards
    const count = await productCards.count();
    for (let i = 0; i < count; i++) {
        const card = productCards.nth(i);
        const image = card.locator('img[alt]'); // Assuming images have alt attribute
        const name = card.locator('h2, h3, h4'); // Assuming product name is a heading
        const price = card.locator('text=/\$\d+(\.\d{2})?/'); // Price with dollar format
        await expect(image).toBeVisible();
        await expect(name).toBeVisible();
        await expect(price).toBeVisible();
    }
});

// Test case for TC-003: Verify navigation to product detail page from product card

test('TC-003 - Verify navigation to product detail page from product card', async ({ page }) => {
    await page.goto(BASE_URL);
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    await firstProductCard.click();
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    // Assert URL contains product-detail and a product id parameter
    await expect(page).toHaveURL(/.*product-detail.*\?id=\d+/);
    // Additionally, verify key detail page element is visible
    const detailTitle = page.locator('[data-testid="product-detail-title"]');
    await expect(detailTitle).toBeVisible();
});