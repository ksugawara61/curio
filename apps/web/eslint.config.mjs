import { createReactConfig } from "@curio/eslint-config/react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  createReactConfig(),
);
