/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.a11y.test.tsx'],
    exclude: [
      'node_modules',
      'tests/e2e/**',
      '**/*.spec.ts',
      'external/**',
      '**/@testing-library/**',
      'vite.config.ts',
      'vitest.config.ts',
      'playwright.config.ts',
      '.eslintrc.js',
      'eslint.config.js',
      'vite-env.d.ts',
    ],
    mockReset: true, // ✅ enable resetting mocks between tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        '**/*.test.*',
        '**/*.spec.*',
        '**/e2e/**',
        '**/vitest.setup.ts',
        '**/types/**',
        '**/node_modules/**',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        '.eslintrc.js',
        'eslint.config.js',
        'vite-env.d.ts',
      ],
    },
  },
});
