import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createGraphQLClientConfig } from "@repo/eslint-config/graphql";
import { createReactConfig } from "@repo/eslint-config/react";
import { createTestingConfig } from "@repo/eslint-config/testing";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaPath = resolve(
  __dirname,
  "../../packages/graphql-client/src/graphql/schema.graphql",
);

export default tseslint.config(
  ...createGraphQLClientConfig(__dirname, {
    schemaPath,
    ignores: ["node_modules/**", "dist/**", ".storybook/**", "public/**"],
  }),
  createReactConfig(),
  createTestingConfig(),
);
