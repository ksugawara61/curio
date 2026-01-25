import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import reactHooks from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaPath = resolve(
  __dirname,
  "../../packages/graphql-client/src/graphql/schema.graphql",
);

const graphQLConfig = {
  schema: schemaPath,
  documents: [`${__dirname}/src/**/*.{js,mjs,ts,mts,jsx,tsx}`],
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
    files: ["src/**/*.{js,mjs,ts,mts,jsx,tsx}"],
    extends: [tseslint.configs.base],
    processor: graphqlPlugin.processor,
    plugins: {
      "prefer-arrow-functions": preferArrowFunctions,
      "react-hooks": reactHooks,
    },
    rules: {
      "prefer-arrow-functions/prefer-arrow-functions": [
        "error",
        {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: "unchanged",
          singleReturnOnly: false,
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "src/**/__tests__/**/*.{ts,tsx}",
    ],
    plugins: {
      "testing-library": testingLibrary,
    },
    rules: {
      ...testingLibrary.configs["flat/react"].rules,
    },
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
      "@graphql-eslint/alphabetize": [
        "error",
        { selections: ["OperationDefinition", "FragmentDefinition"] },
      ],
      "@graphql-eslint/no-anonymous-operations": "error",
    },
  },
);
