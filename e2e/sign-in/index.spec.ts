import { expect, test } from '@playwright/test';

import { TEST_EMAIL, TEST_PASSWORD } from '../account.const';

/**
 * Sign-In E2E tests.
 *
 * - UI/validation tests: chạy KHÔNG có session (storageState: undefined)
 *   vì cần test trang login thật sự, không bị redirect.
 * - Happy path: dùng credentials cùng với auth.setup.ts để đảm bảo user tồn tại.
 */

test.describe('Sign-In Page — UI & Validation (unauthenticated)', () => {
  // Override storageState: chạy không có session
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
  });

  test('should render sign-in form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show link to sign-up page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL('/sign-up');
  });

  test('should not navigate on empty form submission', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();
    // react-hook-form blocks submit → stays on /sign-in
    await expect(page).toHaveURL('/sign-in');
  });

  test('should not navigate on invalid email format', async ({ page }) => {
    await page.locator('input[name="email"]').fill('not-an-email');
    await page.locator('input[name="password"]').fill('anypassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/sign-in');
  });

  test.describe('Sign-In Page — Happy Path', () => {
    test('should redirect away from /sign-in after successful login', async ({ page }) => {
      await page.locator('input[name="email"]').fill(TEST_EMAIL);
      await page.locator('input[name="password"]').fill(TEST_PASSWORD);
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForTimeout(2000);
      await expect(page).not.toHaveURL(/sign-in/);
    });
  });
});
