import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";

import "../src/pages/style.css";
import { useEffect } from "react";
import type { PartialStoryFn } from "storybook/internal/types";
import { StorybookProvider } from "../src/libs/test/StorybookProvider";

initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: "rosepine-dawn",
        dark: "rosepine-moon",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    (Story: PartialStoryFn, context) => {
      const swrFallback = context.parameters?.swr?.fallback as
        | Record<string, unknown>
        | undefined;

      useEffect(() => {
        // Story 切り替え後に msw のレスポンスを更新するためリロードする
        return () => window.location.reload();
      }, []);

      return (
        <StorybookProvider swrFallback={swrFallback}>
          <Story />
        </StorybookProvider>
      );
    },
  ],
  loaders: [mswLoader],
};

export default preview;
