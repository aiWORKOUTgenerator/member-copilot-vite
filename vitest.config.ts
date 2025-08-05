import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    // Retry flaky tests (especially integration tests)
    retry: process.env.CI ? 2 : 0,
    // Parallelize tests for faster execution
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        // Start with lower thresholds, increase gradually
        global: {
          branches: 60, // Start at 60%, increase to 80% in next sprint
          functions: 60,
          lines: 60,
          statements: 60,
        },
        // Critical components should have higher coverage
        "./src/modules/dashboard/trainer/": {
          branches: 80, // Start at 80%, increase to 90% in next sprint
          functions: 80,
          lines: 80,
          statements: 80,
        },
        "./src/hooks/": {
          branches: 70, // Start at 70%, increase to 85% in next sprint
          functions: 70,
          lines: 70,
          statements: 70,
        },
        // UI components should have good coverage
        "./src/ui/shared/atoms/": {
          branches: 50, // Start at 50%, increase to 70% in next sprint
          functions: 50,
          lines: 50,
          statements: 50,
        },
        "./src/ui/shared/molecules/": {
          branches: 40, // Start at 40%, increase to 60% in next sprint
          functions: 40,
          lines: 40,
          statements: 40,
        },
        // Services should have high coverage
        "./src/services/": {
          branches: 80, // Start at 80%, increase to 90% in next sprint
          functions: 80,
          lines: 80,
          statements: 80,
        },
        // Workout module should have good coverage
        "./src/modules/dashboard/workouts/": {
          branches: 30, // Start at 30%, increase to 50% in next sprint
          functions: 30,
          lines: 30,
          statements: 30,
        },
      },
      exclude: [
        "src/setupTests.ts",
        "src/__tests__/**",
        "src/**/*.d.ts",
        "src/**/*.config.*",
        "src/**/*.test.*",
        "src/**/*.spec.*",
        "src/__mocks__/**",
      ],
    },
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
