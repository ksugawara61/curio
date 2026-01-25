import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "@apollo/client"],
    alias: {
      // Redirect all react/react-dom imports to extension's node_modules
      react: resolve(__dirname, "node_modules/react"),
      "react-dom": resolve(__dirname, "node_modules/react-dom"),
      // Redirect @apollo/client to extension's node_modules
      "@apollo/client/react": resolve(
        __dirname,
        "node_modules/@apollo/client/react",
      ),
      "@apollo/client": resolve(__dirname, "node_modules/@apollo/client"),
      // Use graphql-client source directly to avoid bundled dependencies
      "@curio/graphql-client": resolve(
        __dirname,
        "../../packages/graphql-client/src/index.ts",
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["./src/**/test.{ts,tsx}"],
    setupFiles: ["./src/libs/test/setup.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/tests/vrt/**",
    ],
  },
});
