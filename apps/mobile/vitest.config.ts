import react from "@vitejs/plugin-react";
import { type Plugin, transformWithEsbuild } from "vite";
import { defineConfig } from "vitest/config";

// @expo/vector-icons の .js ファイルに含まれる JSX を変換する Vite プラグイン
// createIconSet.js 等が JSX 構文を使用しているが、拡張子が .js のため
// デフォルトの Vite / esbuild では JSX としてパースされない問題を解決する
const expoVectorIconsJsx = (): Plugin => ({
  name: "expo-vector-icons-jsx",
  async transform(code, id) {
    if (id.includes("@expo/vector-icons") && id.endsWith(".js")) {
      return transformWithEsbuild(code, id, { loader: "jsx" });
    }
  },
});

export default defineConfig({
  plugins: [react(), expoVectorIconsJsx()],
  define: {
    // @expo/vector-icons 内部で __DEV__ グローバル変数を参照しているため定義が必要
    __DEV__: true,
  },
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
        inline: ["@curio/testing-library", "@expo/vector-icons"],
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
