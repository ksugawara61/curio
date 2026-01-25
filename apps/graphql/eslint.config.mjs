import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGraphQLServerConfig } from "@curio/eslint-config/graphql";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createGraphQLServerConfig(__dirname, {
  ignores: ["node_modules/**", "dist/**", "src/generated/**"],
});
