import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.test.tsx"],
      rollupTypes: false,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        setup: resolve(__dirname, "src/setup.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "@apollo/client",
        "@apollo/client/react",
        "@testing-library/react",
        "@testing-library/jest-dom",
        "msw",
        "msw/node",
        "gql.tada",
        "vitest",
      ],
    },
  },
});
