import { test, expect } from '@playwright/test';

const expectedOptions = ['General Inquiry', 'Support', 'Feedback'];

test('TC-003 - Verify Subject Dropdown Options', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const subjectDropdown = await page.getByRole('combobox', { name: /subject/i });
  await subjectDropdown.click(); // Open the dropdown

  const options = await subjectDropdown.locator('option').allTextContents();
  expect(options).toEqual(expectedOptions);
});