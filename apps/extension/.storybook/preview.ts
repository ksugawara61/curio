import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react";

import "../src/pages/style.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
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
  ],
};

export default preview;
