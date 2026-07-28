import { test, expect } from '@playwright/test';

const baseURL = 'https://testsmith-io.github.io/practice-software-testing/#/';

test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
});

test('TC-001: Display of Product Cards on Home Page', async ({ page }) => {
    const productGrid = await page.getByRole('grid'); // Assuming the product grid is defined as a role
    await expect(productGrid).toBeVisible();
});

test('TC-002: Product Card Content Verification', async ({ page }) => {
    const productCards = await page.getByRole('gridcell'); // Assuming product cards are grid cells
    const cards = await productCards.count();
    expect(cards).toBeGreaterThan(0);

    for (let i = 0; i < cards; i++) {
        const card = productCards.nth(i);
        const image = await card.locator('img'); // Assuming product image is inside an <img> tag
        const name = await card.locator('h2'); // Assuming product name is in an <h2> tag
        const price = await card.locator('.price'); // Assuming price has a class of 'price'

        await expect(image).toBeVisible();
        await expect(name).toHaveText(/.+/); // Ensuring the name has some text
        await expect(price).toHaveText(/\$\d+/); // Ensuring price format is valid
    }
});

test('TC-003: Navigation to Product Detail Page', async ({ page }) => {
    const productCards = await page.getByRole('gridcell');
    await expect(productCards).toHaveCountGreaterThan(0);

    const firstCard = productCards.nth(0);
    const productLink = await firstCard.getByRole('link'); // Assuming there's a link in the product card
    await productLink.click();

    await expect(page).toHaveURL(/\/product\/*/); // Assuming product detail page URL pattern
    await expect(page).toHaveTitle(/Product Detail/); // Assuming the product detail page has a title
});