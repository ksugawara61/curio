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
    config.resolve.alias = {
      ...config.resolve.alias,
      // react-native を react-native-web にエイリアスしてブラウザで動かす
      "react-native": "react-native-web",
      // Expo / Clerk のネイティブモジュールをモックに差し替える
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
