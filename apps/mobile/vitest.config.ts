import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // react-native を react-native-web にエイリアスして jsdom 環境で動かす
      "react-native": "react-native-web",
    },
    dedupe: [
      "react",
      "react-dom",
      "@apollo/client",
      "@testing-library/react",
      "swr",
      "react-error-boundary",
    ],
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
    ],
    server: {
      deps: {
        // @curio/testing-library を Vite 経由でインライン処理し、
        // モジュール解決の dedupe/alias を適用してReactの多重コピーを防ぐ
        inline: ["@curio/testing-library"],
      },
    },
    coverage: {
      provider: "v8",
      include: ["src/features/**"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/test.{ts,tsx}",
        "**/*.mocks.{ts,tsx}",
        "**/mocks.{ts,tsx}",
        "**/*.d.ts",
        "**/*.stories.{ts,tsx}",
        "**/stories.{ts,tsx}",
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
