import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    'process.env.NEXT_PUBLIC_SITE_URL': JSON.stringify('http://localhost:3000'),
    'process.env.NEXT_PUBLIC_API_URL': JSON.stringify('http://localhost:3000/api'),
    'process.env.NEXT_PUBLIC_IS_DEBUG': JSON.stringify('false'),
    'process.env.NODE_ENV': JSON.stringify('test'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: 'vitest.setup.ts',
    // browser mode (chỉ dùng khi cần)
    browser: {
      enabled: false,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
