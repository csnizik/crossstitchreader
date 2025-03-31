import { test, expect } from '@playwright/test';

test('loads homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Cross Stitch/i);
});
