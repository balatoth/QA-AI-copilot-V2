import { test, expect } from '@playwright/test';

test('TC-001: Display Product Detail Page', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.click('text=Some Product Name'); // Replace with a reasonable product text selector
    await expect(page).toHaveURL(/.*product-detail/); // Ensure it navigates to the product detail page
});

test('TC-002: Verify Product Details Displayed', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail');
    expect(await page.locator('img.product-image')).toBeVisible(); // Assuming this is the selector for product image
    expect(await page.locator('h1.product-name')).toBeVisible(); // Assuming this is the selector for product name
    expect(await page.locator('p.product-description')).toBeVisible(); // Assuming this is the selector for product description
    expect(await page.locator('.product-price')).toBeVisible(); // Assuming this is the selector for product price
    expect(await page.locator('.category-badge')).toBeVisible(); // Assuming this is the selector for category badge
    expect(await page.locator('.brand-badge')).toBeVisible(); // Assuming this is the selector for brand badge
});

test('TC-003: Display Related Products Section', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/product-detail');
    const relatedProducts = await page.locator('.related-products-section'); // Assuming this is the selector for related products
    await expect(relatedProducts).toBeVisible();
    const products = await relatedProducts.locator('.related-product'); // Assuming this is the selector for each related product
    const count = await products.count();
    for (let i = 0; i < count; i++) {
        const productLink = await products.nth(i).getAttribute('href'); // Assuming href attribute points to the product detail
        await products.nth(i).click();
        await expect(page).toHaveURL(productLink);
        await page.goBack(); // Go back to the previous page after verifying the link
    }
});