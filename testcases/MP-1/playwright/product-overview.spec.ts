import { test, expect } from '@playwright/test';

const baseUrl = 'https://v1.practicesoftwaretesting.com';

test('Display of Product Cards on Home Page', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.locator('[data-test="product-1"]')).toBeVisible();
    await expect(page.locator('[data-test="product-2"]')).toBeVisible();
    await expect(page.locator('[data-test="product-3"]')).toBeVisible();
    await expect(page.locator('[data-test="product-4"]')).toBeVisible();
    await expect(page.locator('[data-test="product-5"]')).toBeVisible();
    await expect(page.locator('[data-test="product-6"]')).toBeVisible();
    await expect(page.locator('[data-test="product-7"]')).toBeVisible();
    await expect(page.locator('[data-test="product-8"]')).toBeVisible();
    await expect(page.locator('[data-test="product-9"]')).toBeVisible();
    await expect(page.locator('[data-test="product-10"]')).toBeVisible();
    await expect(page.locator('[data-test="product-11"]')).toBeVisible();
    await expect(page.locator('[data-test="product-12"]')).toBeVisible();
    await expect(page.locator('[data-test="product-13"]')).toBeVisible();
    await expect(page.locator('[data-test="product-14"]')).toBeVisible();
    await expect(page.locator('[data-test="product-15"]')).toBeVisible();
    await expect(page.locator('[data-test="product-16"]')).toBeVisible();
    await expect(page.locator('[data-test="product-17"]')).toBeVisible();
    await expect(page.locator('[data-test="product-18"]')).toBeVisible();
    await expect(page.locator('[data-test="product-19"]')).toBeVisible();
    await expect(page.locator('[data-test="product-20"]')).toBeVisible();
    await expect(page.locator('[data-test="product-21"]')).toBeVisible();
    await expect(page.locator('[data-test="product-22"]')).toBeVisible();
    await expect(page.locator('[data-test="product-23"]')).toBeVisible();
    await expect(page.locator('[data-test="product-24"]')).toBeVisible();
    await expect(page.locator('[data-test="product-25"]')).toBeVisible();
    await expect(page.locator('[data-test="product-26"]')).toBeVisible();
});

test('Navigation to Product Detail Page', async ({ page }) => {
    await page.goto(baseUrl);
    await page.locator('[data-test="product-1"]').click();
    await expect(page).toHaveURL(/product/);
});