import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    silent: false,
    watch: false,
    env: {
      NODE_ENV: "test",
    },
  },
});
