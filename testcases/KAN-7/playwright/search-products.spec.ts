import { test, expect } from '@playwright/test';
import { SearchPage } from './page-objects/SearchPage';

const searchPage = new SearchPage();

test.describe('Product Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  });

  test('Valid Search Keyword Returns Matching Products', async ({ page }) => {
    await searchPage.searchForKeyword(page, 'shoes');
    await expect(searchPage.resultContainer).toBeVisible();
    await expect(searchPage.resultContainer).toContainText('shoes');
  });

  test('Invalid Search Keyword Returns No Results', async ({ page }) => {
    await searchPage.searchForKeyword(page, 'nonexistentproduct');
    await expect(searchPage.emptyMessage).toBeVisible();
  });
});