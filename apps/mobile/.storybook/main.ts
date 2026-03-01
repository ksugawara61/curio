import { resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import react from "@vitejs/plugin-react";

const config: StorybookConfig = {
  stories: ["../src/**/stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["msw-storybook-addon"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: (config) => {
    config.resolve = config.resolve ?? {};
    // .web.* 拡張子を優先的に解決し、Metro Web ビルドと同じモジュール解決を実現する
    // 例: import './useAuth' → useAuth.web.ts が useAuth.ts より優先される
    config.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.js",
      ".tsx",
      ".ts",
      ".js",
      ".json",
    ];
    config.resolve.alias = {
      ...config.resolve.alias,
      // react-native を react-native-web にエイリアスしてブラウザで動かす
      "react-native": "react-native-web",
      // .web ファイルは @clerk/clerk-react を使うため、こちらもモックに差し替える
      "@clerk/clerk-react": resolve(
        import.meta.dirname,
        "../src/libs/storybook/clerk-mock.tsx",
      ),
      // .web ファイルがない機能（sign-in, sign-up 等）は @clerk/clerk-expo を直接使うため維持
      "@clerk/clerk-expo": resolve(
        import.meta.dirname,
        "../src/libs/storybook/clerk-mock.tsx",
      ),
      "expo-router": resolve(
        import.meta.dirname,
        "../src/libs/storybook/expo-router-mock.tsx",
      ),
      "react-native-safe-area-context": resolve(
        import.meta.dirname,
        "../src/libs/storybook/safe-area-mock.tsx",
      ),
      "react-native-webview": resolve(
        import.meta.dirname,
        "../src/libs/storybook/webview-mock.tsx",
      ),
      "@expo/vector-icons/Ionicons": resolve(
        import.meta.dirname,
        "../src/libs/storybook/ionicons-mock.tsx",
      ),
    };
    // nativewind と関連パッケージを事前バンドルに含めて
    // 504 (Outdated Optimize Dep) エラーを防止する
    config.optimizeDeps = config.optimizeDeps ?? {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      "nativewind",
      "react-native-css-interop",
    ];
    // react-native-css-interop の .js ファイルに JSX が含まれるため
    // esbuild プリバンドル時に jsx ローダーを使用する
    config.optimizeDeps.esbuildOptions = {
      ...(config.optimizeDeps.esbuildOptions ?? {}),
      loader: {
        ...(config.optimizeDeps.esbuildOptions?.loader ?? {}),
        ".js": "jsx",
      },
    };
    // react と react-dom を単一インスタンスに強制する
    // @curio/testing-library 経由で react-dom のバージョンが異なる場合の不一致を防ぐ
    config.resolve.dedupe = [
      ...(config.resolve.dedupe ?? []),
      "react",
      "react-dom",
    ];
    // @storybook/react-vite v10 は @vitejs/plugin-react を自動追加しないため明示的に追加する
    // これにより JSX の自動変換（react/jsx-runtime）が有効になり、
    // 各ファイルで import React from "react" が不要になる
    // jsxImportSource: "nativewind" により nativewind の JSX ランタイムが使用され、
    // className prop が react-native-web で正しくスタイルに変換される
    config.plugins = [
      react({ jsxImportSource: "nativewind" }),
      ...(config.plugins ?? []),
    ];
    return config;
  },
};

export default config;
