import { resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: ["@storybook/addon-links"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use react-native-web for all react-native imports
      "react-native": "react-native-web",
      // Mock packages that use native-only code incompatible with Vite/browser
      "react-native-reanimated": resolve(
        import.meta.dirname,
        "./mocks/react-native-reanimated.ts",
      ),
      "react-native-gesture-handler": resolve(
        import.meta.dirname,
        "./mocks/react-native-gesture-handler.tsx",
      ),
      "react-native-safe-area-context": resolve(
        import.meta.dirname,
        "./mocks/react-native-safe-area-context.tsx",
      ),
      "react-native-screens": resolve(
        import.meta.dirname,
        "./mocks/react-native-screens.tsx",
      ),
      "expo-router": resolve(import.meta.dirname, "./mocks/expo-router.tsx"),
      "expo-status-bar": resolve(
        import.meta.dirname,
        "./mocks/expo-status-bar.ts",
      ),
    };
    // Prefer web-specific file extensions over native ones
    config.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
    ];
    return config;
  },
};

export default config;
