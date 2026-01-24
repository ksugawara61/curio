import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import createGraphQLConfig from "@repo/eslint-config/graphql.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createGraphQLConfig(__dirname);
