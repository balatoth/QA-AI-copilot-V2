// contact-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('TC-001: Verify Accessibility of Contact Form', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('form', { name: /contact/i }).waitFor(); // Assuming the form can be identified by its role and name
    const formVisible = await page.getByRole('form').isVisible();
    expect(formVisible).toBeTruthy();
  });

  test('TC-002: Verify Required Fields in Contact Form', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('form', { name: /contact/i }).waitFor();
    const requiredFields = await page.locator('input[required], textarea[required]');
    expect(await requiredFields.count()).toBeGreaterThan(0);
  });

  test('TC-003: Verify Subject Dropdown Options', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.getByRole('combobox', { name: /subject/i }).click();
    const options = await page.locator('option');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(0); // Change as per your specific options requirement
  });

  test('TC-004: Verify Validation for Message Length', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.fill('textarea', 'Short msg'); // Assuming textarea is the message input
    await page.click('button[type="submit"]'); // Assuming the submit button
    const errorMessage = await page.getByText(/must be at least 50 characters/i).isVisible();
    expect(errorMessage).toBeTruthy();
  });

  test('TC-005: Verify Confirmation Message upon Successful Submission', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.fill('input[name="name"]', 'John Doe'); // Assuming there is an input field for name
    await page.fill('input[name="email"]', 'john.doe@example.com'); // Assuming there is an email input
    await page.fill('textarea', 'This is a valid message with more than 50 characters.'); // Filling the message field
    await page.click('button[type="submit"]'); // Assuming the submit button
    const confirmationMessage = await page.getByText(/confirmation message/i).isVisible(); // Adjust based on actual confirmation text
    expect(confirmationMessage).toBeTruthy();
  });
});