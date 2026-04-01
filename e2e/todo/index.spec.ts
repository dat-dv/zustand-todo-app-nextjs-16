import { expect, test } from '@playwright/test';

import { performLogin } from '../login';

test.describe('Todo Page - Authenticated Flow', () => {
  test.beforeEach(async ({ page }) => {
    await performLogin(page);
    await page.goto('/todo');
  });

  test.describe('Task Creation', () => {
    test('should add a new todo and verify visually', async ({ page }) => {
      const taskTitle = `New Task ${Date.now()}`;
      const input = page.getByPlaceholder(/add a new task/i);
      const submitBtn = page.locator('form:has(input[name="title"]) button[type="submit"]');
      await input.fill(taskTitle);
      await submitBtn.click();
      // Pure UI Verification
      await expect(page.getByText(taskTitle)).toBeVisible();
      await expect(input).toHaveValue('');
    });

    test('should maintain button disabled state for empty input', async ({ page }) => {
      const submitBtn = page.locator('form:has(input[name="title"]) button[type="submit"]');
      await expect(submitBtn).toBeDisabled();
      const input = page.getByPlaceholder(/add a new task/i);
      await input.fill('   ');
      await expect(submitBtn).toBeDisabled();
      await input.fill('Valid Task');
      await expect(submitBtn).toBeEnabled();
    });
  });

  test.describe('Task Management', () => {
    let activeTaskTitle: string;

    test.beforeEach(async ({ page }) => {
      activeTaskTitle = `Manageable Task ${Date.now()}`;
      await page.getByPlaceholder(/add a new task/i).fill(activeTaskTitle);
      await page.locator('form:has(input[name="title"]) button[type="submit"]').click();
    });

    test('should toggle task completion status', async ({ page }) => {
      const taskItem = page.getByText(activeTaskTitle);
      await taskItem.click();
      // Verify the UI change (Line-through)
      await expect(taskItem).toHaveCSS('text-decoration-line', 'line-through');
    });

    test('should delete a task from the list', async ({ page }) => {
      const taskRow = page.locator('.group').filter({ hasText: activeTaskTitle }).last();
      await taskRow.hover();
      const deleteBtn = taskRow.locator('button').filter({ has: page.locator('.lucide-trash-2') });
      await deleteBtn.click();
      // Verify the UI change (Removal)
      await expect(page.getByText(activeTaskTitle)).not.toBeVisible();
    });
  });
});

test.describe('Todo Page - Security', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test('should redirect unauthenticated users to the sign-in page', async ({ page }) => {
    await page.goto('/todo');
    await expect(page).toHaveURL(/.*sign-in.*/);
  });
});
