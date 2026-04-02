// vitest.config.ts
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

if (process.loadEnvFile) {
  process.loadEnvFile();
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    'process.env': process.env,
  },
  test: {
    globals: true,
    environment: 'jsdom', // default cho unit/component test
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: 'vitest.setup.ts',
    // ---- Browser mode với Playwright ----
    browser: {
      enabled: true, // bật browser
      provider: playwright({
        launchOptions: {
          headless: true, // chạy background
          slowMo: 50, // chậm 50ms mỗi action để dễ debug
        },
        actionTimeout: 5_000,
        persistentContext: true, // lưu cookies, localStorage giữa các file test
      }),
      instances: [
        { browser: 'chromium' }, // instance Chromium
        // { browser: 'firefox' }, // instance Firefox
        // { browser: 'webkit' }, // instance Webkit (Safari)
      ],
    },
  },
});
