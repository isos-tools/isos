import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  test: {
    // pool: 'threads',

    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['**/*.test.ts'],
          exclude: [
            ...configDefaults.exclude,
            '**/_old/**',
            'unified-latex-forks/**',
          ],
          testTimeout: 60_000,
          hookTimeout: 60_000,
        },
      },
      {
        test: {
          name: 'browser',
          include: ['**/*.browsertest.ts'],
          // setupFiles: ['./src/__test__/browser-setup.ts'],
          // css: {
          //   include: /.+/,
          // },
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [
              {
                browser: 'chromium',
                viewport: { width: 720, height: 280 },
              },
            ],
          },
          testTimeout: 60_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
});
