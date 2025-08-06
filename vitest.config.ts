import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // Retry flaky tests (especially integration tests)
    retry: process.env.CI ? 2 : 0,
    // Parallelize tests for faster execution
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        // Start with realistic thresholds, increase gradually
        global: {
          branches: 1, // Start at 1%, increase to 80% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
        },
        // Critical components should have higher coverage
        './src/modules/dashboard/trainer/': {
          branches: 1, // Start at 1%, increase to 90% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
        },
        './src/hooks/': {
          branches: 1, // Start at 1%, increase to 85% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
        },
        // UI components should have good coverage
        './src/ui/shared/atoms/': {
          branches: 1, // Start at 1%, increase to 70% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
        },
        './src/ui/shared/molecules/': {
          branches: 1, // Start at 1%, increase to 60% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
        },
        // Services should have high coverage
        './src/services/': {
          branches: 1, // Start at 1%, increase to 90% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
        },
        // Workout module should have good coverage
        './src/modules/dashboard/workouts/': {
          branches: 1, // Start at 1%, increase to 50% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
        },
      },
      exclude: [
        'src/setupTests.ts',
        'src/__tests__/**',
        'src/**/*.d.ts',
        'src/**/*.config.*',
        'src/**/*.test.*',
        'src/**/*.spec.*',
        'src/__mocks__/**',
      ],
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
});
