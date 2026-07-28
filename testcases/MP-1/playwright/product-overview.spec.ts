import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v1.practicesoftwaretesting.com';

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCards = await page.locator('[data-test="product-1"],[data-test="product-2"],[data-test="product-3"],[data-test="product-4"],[data-test="product-5"],[data-test="product-6"],[data-test="product-7"],[data-test="product-8"],[data-test="product-9"],[data-test="product-10"]');
    await expect(productCards).toHaveCount(10);
});


test('TC-002: Product Card Content Verification', async ({ page }) => {
    await page.goto(BASE_URL);
    const products = [
        { name: 'Combination Pliers', price: '$14.15' },
        { name: 'Pliers', price: '$12.01' },
        { name: 'Bolt Cutters', price: '$48.41' },
        { name: 'Long Nose Pliers', price: '$14.24' },
        { name: 'Slip Joint Pliers', price: '$9.17' },
        { name: 'Claw Hammer with Shock Reduction Grip', price: '$13.41' },
        { name: 'Hammer', price: '$12.58' },
        { name: 'Claw Hammer', price: '$11.48' },
        { name: 'Thor Hammer', price: '$11.14' },
        { name: 'Sledgehammer', price: '$17.75' }
    ];

    for (const product of products) {
        const nameSelector = page.locator(`text=${product.name}`);
        const priceSelector = page.locator(`text=${product.price}`);
        await expect(nameSelector).toBeVisible();
        await expect(priceSelector).toBeVisible();
    }
});


test('TC-003: Navigation to Product Detail Page', async ({ page }) => {
    await page.goto(BASE_URL);
    const productCard = page.locator('[data-test="product-1"]');
    await productCard.click();
    await expect(page).toHaveURL(/product-detail/);
});