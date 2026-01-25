import { createBaseConfig } from "@repo/eslint-config/base";

export default createBaseConfig({
  ignores: ["node_modules/**", "dist/**", "src/graphql/graphql-env.d.ts"],
});
