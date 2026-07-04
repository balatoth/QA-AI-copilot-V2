import { test, expect } from '@playwright/test';
import { SearchPage } from './pageObjects/searchPage';

const searchPage = new SearchPage();

test.describe('Search Products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  });

  test('Valid Search Keyword Returns Matching Products', async ({ page }) => {
    await searchPage.login(page); // Assuming a login method exists
    await searchPage.searchForProduct(page, 'valid keyword');
    await expect(searchPage.resultsContainer(page)).toBeVisible();
    await expect(searchPage.resultsContainer(page)).toHaveText(/matching products/i);
  });

  test('Invalid Search Keyword Returns No Results', async ({ page }) => {
    await searchPage.login(page); // Assuming a login method exists
    await searchPage.searchForProduct(page, 'invalid keyword');
    await expect(searchPage.emptyMessage(page)).toBeVisible();
    await expect(searchPage.emptyMessage(page)).toHaveText(/no results found/i);
  });
});