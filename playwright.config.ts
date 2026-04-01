import { defineConfig, devices } from '@playwright/test';

if (process.loadEnvFile) {
  process.loadEnvFile();
}

/**
 * =========================
 * Playwright E2E Config
 * =========================
 *
 * 🎯 Mục tiêu:
 * - Chạy E2E test cho toàn bộ flow user (login, todo, etc.)
 * - Tự động start server trước khi test
 *
 * 📁 Structure gợi ý:
 * - e2e/
 *    ├── global-setup.ts   # setup global (login, seed data...)
 *    ├── *.spec.ts         # test files
 * - playwright.config.ts
 */

export default defineConfig({
  /**
   * 📂 Thư mục chứa E2E tests
   */
  testDir: './e2e',

  /**
   * 🚀 Chạy trước toàn bộ test suite
   * - Thường dùng để:
   *   + Login và save storageState (skip login step)
   *   + Seed data test
   */
  globalSetup: './e2e/global-setup.ts',

  /**
   * ⏱ Timeout cho mỗi test (ms)
   * - Tránh test treo vô hạn
   */
  timeout: 30_000,

  /**
   * 📊 Reporter
   * - list: log console
   * - html: report UI sau khi chạy
   *
   * 👉 Mở report:
   * npx playwright show-report
   */
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  /**
   * ⚙️ Config mặc định cho tất cả test
   */
  use: {
    /**
     * 🌐 Base URL
     * - Cho phép dùng:
     *   page.goto('/login')
     */
    baseURL: process.env.NEXT_PUBLIC_SITE_URL,

    /**
     * 🧠 Headless mode
     * - true: chạy ngầm (CI)
     * - false: debug local
     */
    headless: true,

    /**
     * 🖥 Viewport default
     */
    viewport: { width: 1920, height: 1080 },

    /**
     * 🧵 Trace
     * - Debug khi test fail
     * 👉 Mở:
     * npx playwright show-trace trace.zip
     */
    trace: 'on-first-retry',

    /**
     * 📸 Screenshot khi fail
     */
    screenshot: 'only-on-failure',

    /**
     * 📹 Video khi fail
     */
    video: 'retain-on-failure',
  },

  /**
   * 🌍 Multi-browser (hiện tại chỉ Chromium)
   * - Có thể mở rộng:
   *   + firefox
   *   + webkit (Safari)
   */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /**
   * 🚀 Auto start server trước khi test
   *
   * Flow:
   * 1. Playwright chạy command
   * 2. Đợi server ready tại url
   * 3. Run test
   *
   * 👉 Ưu điểm:
   * - Không cần dev tự chạy `npm run dev`
   * - CI/CD chạy ổn định
   */
  webServer: {
    /**
     * Command start app
     * ⚠️ Nên dùng:
     * - dev (local)
     * - start (production build) cho CI
     */
    command: 'npm run dev',

    /**
     * URL để check server ready
     */
    url: process.env.NEXT_PUBLIC_SITE_URL,

    /**
     * ♻️ Reuse server nếu đang chạy
     * - true: local dev nhanh hơn
     * - false: CI nên disable
     */
    reuseExistingServer: true,

    /**
     * ⏳ Timeout chờ server start
     * - Next.js cold start khá lâu
     */
    timeout: 120_000,

    /**
     * 📜 Log server (debug khi fail)
     */
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
