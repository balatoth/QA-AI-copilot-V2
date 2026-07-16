import { test, expect } from '@playwright/test';

const baseUrl = 'https://testsmith-io.github.io/practice-software-testing/#/';

test('TC-003 - Verify Subject Dropdown Options', async ({ page }) => {
  await page.goto(baseUrl);
  const contactLink = page.getByRole('link', { name: 'Contact' });
  await contactLink.click();

  const subjectDropdown = await page.getByRole('combobox', { name: 'Subject' }); // Assuming the dropdown has a label
  await subjectDropdown.click();

  const options = await subjectDropdown.locator('option').allTextContents();
  const expectedOptions = ['Option 1', 'Option 2', 'Option 3']; // Adjust based on actual options
  expect(options).toEqual(expectedOptions);
});