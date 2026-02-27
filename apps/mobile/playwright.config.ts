import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/vrt",
  snapshotDir: "./tests/vrt/__screenshots__",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  timeout: 60000,
  use: {
    baseURL: "http://localhost:6007",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: "pnpm storybook",
    url: "http://localhost:6007",
    reuseExistingServer: !process.env.CI,
  },
});
