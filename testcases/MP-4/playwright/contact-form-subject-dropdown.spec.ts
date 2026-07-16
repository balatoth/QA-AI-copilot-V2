import { test, expect } from '@playwright/test';

test('TC-003 - Verify Subject Dropdown Options', async ({ page }) => {
  await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
  const contactLink = await page.getByText('Contact');
  await contactLink.click();
  const subjectDropdown = await page.getByRole('combobox'); // Assuming there's only one dropdown
  await subjectDropdown.click();
  const options = await subjectDropdown.locator('option'); // Adjust according to the actual structure
  expect(await options.count()).toBeGreaterThan(0); // Validate options exist
});