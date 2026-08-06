import { test, expect } from '@playwright/test';

const baseUrl = 'https://v2.practicesoftwaretesting.com';

// Expected title updated to reflect the category page title instead of transient interstitial
const expectedCategoryTitle = 'Hand Tools - Practice Software Testing';

test('TC-001: Display Correct Category Page and Title', async ({ page }) => {
    await page.goto(`${baseUrl}/#`);
    await page.getByRole('link', { name: 'Cloudflare' }).click();
    await expect(page).toHaveURL('https://v2.practicesoftwaretesting.com/#/category/hand-tools');
    await expect(page).toHaveTitle(expectedCategoryTitle);
});