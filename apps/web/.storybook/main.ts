import { resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: (config) => {
    // TanStack Router plugin should not run in Storybook
    config.plugins = (config.plugins ?? []).filter((plugin) => {
      if (!plugin || typeof plugin !== "object" || Array.isArray(plugin)) {
        return true;
      }
      const name = (plugin as { name?: string }).name;
      return (
        name !== "unplugin-router-code-splitter-vite" &&
        name !== "vite-plugin-tanstack-router"
      );
    });

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@clerk/clerk-react": resolve(
        import.meta.dirname,
        "../src/libs/test/clerk-mock.tsx",
      ),
    };
    return config;
  },
};

export default config;
