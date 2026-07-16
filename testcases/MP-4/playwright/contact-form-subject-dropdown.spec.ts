import { test, expect } from '@playwright/test';

test('TC-003 - Verify Subject Dropdown Options', async ({ page }) => {
    await page.goto('https://testsmith-io.github.io/practice-software-testing/#/');
    const subjectDropdown = await page.getByRole('combobox', { name: 'Subject' }); // Assuming the dropdown has an accessible name
    await subjectDropdown.click();

    // Assuming these are the specified options in the dropdown
    const options = [
        'General Inquiry',
        'Support',
        'Feedback'
    ];

    for (const option of options) {
        const isVisible = await page.getByText(option).isVisible();
        expect(isVisible).toBeTruthy();
    }
});