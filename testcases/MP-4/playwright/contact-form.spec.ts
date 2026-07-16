import { test, expect } from '@playwright/test';

const BASE_URL = 'https://testsmith-io.github.io/practice-software-testing/#/';

// Test Case TC-001: Verify Accessibility of Contact Form
test('TC-001: Verify Accessibility of Contact Form', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.getByRole('form')).toBeVisible();
});

// Test Case TC-002: Verify Required Fields in Contact Form
test('TC-002: Verify Required Fields in Contact Form', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.click('text=Contact'); // Assuming there's a button or link to navigate to the contact page
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
});

// Test Case TC-003: Verify Subject Dropdown Options
test('TC-003: Verify Subject Dropdown Options', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.click('text=Contact'); // Navigate to the contact page
  const dropdown = page.getByRole('combobox'); // Assuming the subject dropdown is the first combobox
  await expect(dropdown).toBeVisible();
  const options = await dropdown.evaluate(node => Array.from(node.options).map(option => option.text));
  expect(options).toEqual(['General Inquiry', 'Technical Support', 'Billing']); // Replace with actual options if different
});

// Test Case TC-004: Verify Validation for Message Length
test('TC-004: Verify Validation for Message Length', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.click('text=Contact');
  await page.fill('textarea[name="message"]', 'Short message'); // More than one character but less than 50
  await page.click('button[type="submit"]');
  await expect(page.getByText(/message must be at least 50 characters/i)).toBeVisible();
});

// Test Case TC-005: Verify Confirmation Message upon Successful Submission
test('TC-005: Verify Confirmation Message upon Successful Submission', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.click('text=Contact');
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="email"]', 'john.doe@example.com');
  await page.fill('textarea[name="message"]', 'This is a valid message with more than 50 characters.');
  await page.click('button[type="submit"]');
  await expect(page.getByText(/thank you for your message/i)).toBeVisible();
});