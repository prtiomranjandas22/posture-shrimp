import { test, expect } from '@playwright/test';

test.describe('PostureShrimp Workflow', () => {
  test('has basic dashboard rendering', async ({ page }) => {
    // We would hit localhost:1420 for dev
    await page.goto('http://localhost:1420');
    await expect(page.locator('text=PostureShrimp')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=LOCAL WASM')).toBeVisible();
  });
  
  test('settings page loads and holds sensitivity controls', async ({ page }) => {
    await page.goto('http://localhost:1420/settings');
    await expect(page.locator('text=Alert Sensitivity')).toBeVisible();
  });
});
