import { resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

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
    };
    // react と react-dom を単一インスタンスに強制する
    // @curio/testing-library 経由で react-dom のバージョンが異なる場合の不一致を防ぐ
    config.resolve.dedupe = [
      ...(config.resolve.dedupe ?? []),
      "react",
      "react-dom",
    ];
    return config;
  },
};

export default config;
