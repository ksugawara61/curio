import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";

// Initialize MSW – intercepts fetch/XHR inside Storybook's iframe
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
  loaders: [mswLoader],
};

export default preview;
