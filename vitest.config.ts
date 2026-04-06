// vitest.config.ts
import fs from 'node:fs';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

if (process.loadEnvFile && fs.existsSync('.env')) {
  process.loadEnvFile();
}

console.log('ENV : >>>  ', process.env);

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    conditions: ['browser'],
  },
  define: {
    'process.env': process.env,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    browser: {
      enabled: false, // enable if want to run browser test view on browser
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: 'vitest.setup.ts',
    server: {
      deps: {
        inline: [/@testing-library\/jest-dom/],
      },
    },
  },
  ssr: {
    resolve: {
      conditions: ['browser'],
    },
  },
});
