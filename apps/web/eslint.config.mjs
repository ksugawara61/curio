import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createBaseConfig } from "@curio/eslint-config/base";
import { createReactConfig } from "@curio/eslint-config/react";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  ...createBaseConfig({
    tsconfigRootDir: __dirname,
    ignores: ["node_modules/**", "dist/**"],
  }),
  createReactConfig(),
);
