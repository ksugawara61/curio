import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaPath = resolve(
  __dirname,
  "../../packages/graphql-client/src/graphql/schema.graphql",
);

const graphQLConfig = {
  schema: schemaPath,
  documents: [`${__dirname}/src/**/*.ts`, `${__dirname}/src/**/*.tsx`],
  extensions: {
    pluckConfig: {
      globalGqlIdentifierName: "graphql",
      modules: [
        {
          name: "@curio/graphql-client",
          identifier: "graphql",
        },
      ],
    },
  },
};

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**", ".storybook/**"],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    extends: [tseslint.configs.base],
    processor: graphqlPlugin.processor,
  },
  {
    files: ["**/*.graphql"],
    plugins: {
      "@graphql-eslint": graphqlPlugin,
    },
    languageOptions: {
      parser: graphqlPlugin.parser,
      parserOptions: {
        graphQLConfig,
      },
    },
    rules: {
      ...graphqlPlugin.configs["flat/operations-recommended"].rules,
      "@graphql-eslint/naming-convention": "off",
    },
  },
);
