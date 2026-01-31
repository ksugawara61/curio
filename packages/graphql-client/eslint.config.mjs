import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createBaseConfig } from "@curio/eslint-config/base";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createBaseConfig({
  tsconfigRootDir: __dirname,
  ignores: ["node_modules/**", "dist/**", "src/graphql/graphql-env.d.ts"],
});
