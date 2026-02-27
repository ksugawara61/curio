import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import { useEffect } from "react";
import type { PartialStoryFn } from "storybook/internal/types";
import { StorybookProvider } from "../src/libs/storybook/StorybookProvider";
import "./preview.css";

initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story: PartialStoryFn) => {
      useEffect(() => {
        // Story 切り替え後に msw のレスポンスを更新するためリロードする
        return () => window.location.reload();
      }, []);

      return (
        <StorybookProvider>
          <Story />
        </StorybookProvider>
      );
    },
  ],
  loaders: [mswLoader],
};

export default preview;
