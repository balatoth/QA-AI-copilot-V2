import { test, expect } from '@playwright/test';
import { ProductSearchPage } from './product-search.page';

test.describe('Product Search', () => {
  let page: ProductSearchPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = new ProductSearchPage(await context.newPage());
    await context.close();
  });

  test('Valid Search Keyword Returns Matching Products', async () => {
    await page.navigate();
    await page.search('valid-product');

    const products = await page.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  test('Invalid Search Keyword Returns No Results', async () => {
    await page.navigate();
    await page.search('invalid-product');

    const message = await page.getNoResultsMessage();
    expect(message).toBe('No products found.');
  });
});