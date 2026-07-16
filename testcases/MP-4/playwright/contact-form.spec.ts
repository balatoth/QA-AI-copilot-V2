import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://testsmith-io.github.io/practice-software-testing/#/';

// Helper function to navigate to Contact page and verify navigation
async function navigateToContact(page) {
  await page.goto(baseURL);
  await page.click('text=Contact'); // Navigate to the contact page
  await expect(page).toHaveURL(/.*contact/i);
  const contactForm = page.getByRole('form');
  await expect(contactForm).toBeVisible();
  return contactForm;
}

// Test case TC-001: Verify Accessibility of Contact Form
test('TC-001: Verify Accessibility of Contact Form', async ({ page }) => {
  await page.goto(baseURL);
  await page.click('text=Contact'); // Navigate to the contact page
  await expect(page).toHaveURL(/.*contact/i);
  const contactForm = await page.getByRole('form');
  await expect(contactForm).toBeVisible(); // Check if the contact form is visible
});

// Test case TC-002: Verify Required Fields in Contact Form
test('TC-002: Verify Required Fields in Contact Form', async ({ page }) => {
  await page.goto(baseURL);
  await page.click('text=Contact'); // Navigate to the contact page
  await expect(page).toHaveURL(/.*contact/i);
  const requiredFields = await page.locator('input[required], textarea[required]');
  expect(await requiredFields.count()).toBeGreaterThan(0); // Check that required fields are displayed
});

// Test case TC-003: Verify Subject Dropdown Options
test('TC-003: Verify Subject Dropdown Options', async ({ page }) => {
  await page.goto(baseURL);
  await page.click('text=Contact'); // Navigate to the contact page
  await expect(page).toHaveURL(/.*contact/i);
  await page.click('select[name="subject"]'); // Open the subject dropdown
  const options = await page.locator('select[name="subject"] option');
  const subjectOptions = await options.allTextContents();
  const expectedOptions = ['General Inquiry', 'Support', 'Feedback']; // Update with real options if known
  expect(subjectOptions).toEqual(expect.arrayContaining(expectedOptions)); // Check that expected options are present
});

// Test case TC-004: Verify Validation for Message Length
test('TC-004: Verify Validation for Message Length', async ({ page }) => {
  await page.goto(baseURL);
  await page.click('text=Contact'); // Navigate to the contact page
  await expect(page).toHaveURL(/.*contact/i);
  await page.fill('textarea[name="message"]', 'Short message.'); // Enter a short message
  await page.click('button[type="submit"]'); // Submit the contact form
  const errorMessage = await page.getByText(/message must be at least 50 characters/i);
  await expect(errorMessage).toBeVisible(); // Check if validation error is shown
});

// Test case TC-005: Verify Confirmation Message upon Successful Submission
test('TC-005: Verify Confirmation Message upon Successful Submission', async ({ page }) => {
  await page.goto(baseURL);
  await page.click('text=Contact'); // Navigate to the contact page
  await expect(page).toHaveURL(/.*contact/i);
  await page.fill('input[name="name"]', 'John Doe'); // Fill in name
  await page.fill('input[name="email"]', 'johndoe@example.com'); // Fill in email
  await page.fill('textarea[name="message"]', 'This is a valid message for the contact form.'); // Fill in the message
  await page.selectOption('select[name="subject"]', 'General Inquiry'); // Select subject
  await page.click('button[type="submit"]'); // Submit the contact form
  const confirmationMessage = await page.getByText(/thank you for your message/i);
  await expect(confirmationMessage).toBeVisible(); // Check if confirmation message is shown
});
