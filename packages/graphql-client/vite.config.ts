import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["**/*.test.ts"],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CurioGraphQLClient",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "@apollo/client",
        "@apollo/client/react",
        "@testing-library/react",
        "msw",
        "graphql",
        "gql.tada",
      ],
    },
  },
});
