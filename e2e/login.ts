import { Page } from '@playwright/test';

import { TEST_EMAIL, TEST_PASSWORD } from './account.const';

/**
 * Performs login and ENSURES the session (cookies) is fully established.
 */
export async function performLogin(page: Page) {
  // Console logging for debugging browser-side errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`[Browser-Error] ${msg.text()}`);
  });

  await page.goto('/sign-in');

  await page.getByLabel('Email', { exact: true }).fill(TEST_EMAIL);
  await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);

  /**
   * CRITICAL SECURITY/SESSION NOTE:
   * Next.js uses HttpOnly cookies. If we call page.goto('/todo') immediately after clicking,
   * the browser might not have finished persisting the cookie yet.
   * By waiting for the redirect to complete (to '/' or '/todo'), we guarantee
   * the session is active before the test moves to the next command.
   */
  await Promise.all([
    page.waitForURL((url) => url.pathname === '/' || url.pathname === '/todo', {
      timeout: 15000,
      waitUntil: 'load', // Wait for the target page to actually load
    }),
    page.getByRole('button', { name: /sign in/i }).click(),
  ]);

  console.log(`[E2E-Login] Successfully logged in and redirected to: ${page.url()}`);
}
