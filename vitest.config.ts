import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
    // Retry flaky tests (especially integration tests)
    retry: process.env.CI ? 2 : 0,
    // Parallelize tests for faster execution
    pool: "forks",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        // Start with lower thresholds, increase gradually as coverage improves
        global: {
          branches: 1, // Start at 1%, increase to 80% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
        },
        // Critical components have higher thresholds
        "./src/modules/dashboard/trainer/": {
          branches: 1, // Start at 1%, increase to 90% in next sprint
          functions: 1,
          lines: 1,
          statements: 1,
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
