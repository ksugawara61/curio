import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    check: false,
  },
  viteFinal: (config) => {
    // Remove vite-plugin-dts from the plugins
    if (config.plugins) {
      config.plugins = config.plugins.filter((plugin) => {
        if (!plugin) {
          return true;
        }
        if (typeof plugin === "object" && "name" in plugin) {
          return plugin.name !== "vite:dts";
        }
        return true;
      });
    }
    return config;
  },
};

export default config;
