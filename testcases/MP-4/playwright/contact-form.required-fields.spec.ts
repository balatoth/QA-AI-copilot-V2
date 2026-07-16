import { test, expect } from '@playwright/test';

test('TC-002 - Verify Required Fields in Contact Form', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const nameField = await page.getByLabel('Name');
  const emailField = await page.getByLabel('Email');
  const messageField = await page.getByLabel('Message');

  expect(nameField).toBeVisible();
  expect(emailField).toBeVisible();
  expect(messageField).toBeVisible();
});