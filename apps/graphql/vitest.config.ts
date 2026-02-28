import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}", "**/test.ts"],
    globalSetup: "./src/libs/test/globalSetup.ts",
    setupFiles: "./src/libs/test/vitest.setup.ts",
    silent: false,
    watch: false,
    pool: "forks",
    sequence: {
      concurrent: false,
    },
    maxWorkers: 1,
    env: {
      NODE_ENV: "test",
      PYLON_TELEMETRY_DISABLED: "1",
    },
    coverage: {
      provider: "v8",
      include: ["src/application/**", "src/domain/**"],
      exclude: [
        "**/*.test.ts",
        "**/test.ts",
        "**/*.mocks.ts",
        "**/mocks.ts",
        "**/*.d.ts",
        "**/interface.ts",
        "**/model.ts",
        "**/schema.ts",
      ],
      thresholds: {
        lines: 85,
        branches: 85,
        functions: 85,
        statements: 85,
      },
      reporter: ["text", "json-summary"],
    },
  },
});
