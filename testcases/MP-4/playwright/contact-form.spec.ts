import { test, expect } from '@playwright/test';

test('TC-001 - Verify Accessibility of Contact Form', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const contactForm = await page.getByRole('form', { name: /contact/i });
    expect(contactForm).toBeVisible();
});

test('TC-002 - Verify Required Fields in Contact Form', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const nameField = await page.getByLabel('Name');
    const emailField = await page.getByLabel('Email');
    const messageField = await page.getByLabel('Message');
    expect(nameField).toBeVisible();
    expect(emailField).toBeVisible();
    expect(messageField).toBeVisible();
});

test('TC-003 - Verify Subject Dropdown Options', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const subjectDropdown = await page.getByRole('combobox', { name: /subject/i });
    await subjectDropdown.click();
    const options = await subjectDropdown.locator('option').allTextContents();
    const expectedOptions = ['General Inquiry', 'Support', 'Feedback']; // Example options, modify based on real options
    expect(options).toEqual(expect.arrayContaining(expectedOptions));
});

test('TC-004 - Verify Validation for Message Length', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.fill('textarea[name="message"]', 'Short msg');
    await page.click('button[type="submit"]');
    const errorMessage = await page.getByText(/message must be at least 50 characters/i);
    expect(errorMessage).toBeVisible();
});

test('TC-005 - Verify Confirmation Message upon Successful Submission', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a valid message with more than 50 characters.');
    await page.click('button[type="submit"]');
    const confirmationMessage = await page.getByText(/thank you for your message/i);
    expect(confirmationMessage).toBeVisible();
});