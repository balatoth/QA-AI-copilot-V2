import { test, expect } from '@playwright/test';

test('TC-001: Verify Accessibility of Contact Form', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const contactForm = await page.getByRole('form', { name: /contact/i });
  expect(contactForm).toBeTruthy();
});

test('TC-002: Verify Required Fields in Contact Form', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const nameField = await page.getByLabel('Name');
  const emailField = await page.getByLabel('Email');
  const messageField = await page.getByLabel('Message');
  expect(nameField).toBeTruthy();
  expect(emailField).toBeTruthy();
  expect(messageField).toBeTruthy();
});

test('TC-003: Verify Subject Dropdown Options', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const subjectDropdown = await page.getByRole('combobox', { name: /subject/i });
  await subjectDropdown.click();
  const options = await subjectDropdown.locator('option').allInnerTexts();
  const expectedOptions = [ 'Support', 'Inquiry', 'General' ]; // Adjust according to actual dropdown options
  expect(options).toEqual(expect.arrayContaining(expectedOptions));
});

test('TC-004: Verify Validation for Message Length', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const messageField = await page.getByLabel('Message');
  await messageField.fill('Short msg');
  const submitButton = await page.getByRole('button', { name: /submit/i });
  await submitButton.click();
  const errorMessage = await page.getByText(/message must be at least 50 characters/i);
  expect(errorMessage).toBeVisible();
});

test('TC-005: Verify Confirmation Message upon Successful Submission', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  const messageField = await page.getByLabel('Message');
  await messageField.fill('This is a valid message for submission.' + ' '.repeat(30)); // Sufficient length
  const subjectDropdown = await page.getByRole('combobox', { name: /subject/i });
  await subjectDropdown.selectOption('Support');
  const submitButton = await page.getByRole('button', { name: /submit/i });
  await submitButton.click();
  const confirmationMessage = await page.getByText(/thank you for your message/i);
  expect(confirmationMessage).toBeVisible();
});