import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./src/libs/test/globalSetup.ts",
    setupFiles: "./src/libs/test/vitest.setup.ts",
    silent: false,
    watch: false,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    sequence: {
      concurrent: false,
    },
    env: {
      NODE_ENV: "test",
      PYLON_TELEMETRY_DISABLED: "1",
    },
  },
});
