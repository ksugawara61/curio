import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/stories.@(js|jsx|mjs|ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // viteFinal(config) {
  //   return mergeConfig(config, {
  //     plugins: [tailwindcss()],
  //   });
  // },
};

export default config;
