import { test, expect } from '@playwright/test';

test('TC-001: Display Product Detail Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('link', { name: /product name/i }).click(); // Assumption: Product link contains the product name
    await expect(page).toHaveURL(/.*product-detail/); // Assumption: product detail page contains 'product-detail' in its URL
});

test('TC-002: Verify Product Details Displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail');
    await expect(page.getByRole('img')).toBeVisible(); // Assumption: Image is displayed with role 'img'
    await expect(page.getByRole('heading')).toBeVisible(); // Assumption: Product name is displayed as a heading
    await expect(page.getByText(/description/i)).toBeVisible(); // Assumption: Description text is visible
    await expect(page.getByText(/\$\d+/)).toBeVisible(); // Assumption: Price is displayed as a formatted dollar value
    await expect(page.getByText('Category')).toBeVisible(); // Assumption: 'Category' badge is visible
    await expect(page.getByText('Brand')).toBeVisible(); // Assumption: 'Brand' badge is visible
});

test('TC-003: Display Related Products Section', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail');
    await expect(page.getByText('Related Products')).toBeVisible(); // Assumption: Section contains 'Related Products' text
    const relatedProducts = await page.$$('selector-for-related-products'); // Replace with appropriate selector
    for(const product of relatedProducts) {
        await expect(product).toBeClickable(); // Assumption: Each related product should be clickable.
    }
});