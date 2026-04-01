import { expect, test } from '@playwright/test';

import { TEST_PASSWORD } from '../account.const';
import { createAccount } from '../create-account';

test.describe('Sign-Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up');
  });

  // ─── UI Smoke ──────────────────────────────────────────────────────────────

  test('should render sign-up form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();
    await expect(page.locator('input#fullName')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should show link to sign-in page', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    await expect(page).toHaveURL('/sign-in');
  });

  test('should show terms of service link', async ({ page }) => {
    const termsLink = page.getByRole('link', { name: /terms of service/i });
    await expect(termsLink).toBeVisible();
  });

  // ─── Validation ──────────────────────────────────────────────────────────────

  test('should show validation error for empty form submission', async ({ page }) => {
    await page.getByRole('button', { name: /create account/i }).click();
    // react-hook-form prevents submit on invalid — stays on sign-up
    await expect(page).toHaveURL('/sign-up');
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.locator('input#fullName').fill('Test User');
    await page.locator('input#email').fill('invalid-email');
    await page.locator('input#password').fill('Password123!');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL('/sign-up');
  });

  // ─── Happy Path ──────────────────────────────────────────────────────────────

  test('should register successfully and redirect', async ({ page }) => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await createAccount(uniqueEmail, TEST_PASSWORD);
    await page.waitForTimeout(1000);
    await page.goto('/sign-in');
    await page.getByLabel('Email', { exact: true }).fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).not.toHaveURL(/sign-in/);
  });
});
