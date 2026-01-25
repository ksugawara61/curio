import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import tseslint from "typescript-eslint";
import { createBaseConfig } from "./base.js";

/**
 * Creates GraphQL ESLint configuration for client-side operations.
 * Use this for projects that consume GraphQL APIs.
 *
 * @param {string} dirname - The directory path (__dirname)
 * @param {Object} options - Configuration options
 * @param {string} options.schemaPath - Path to the GraphQL schema file
 * @param {string[]} [options.files] - File patterns for source files
 * @param {string[]} [options.ignores] - Patterns to ignore
 * @returns {import('typescript-eslint').ConfigArray}
 */
export const createGraphQLClientConfig = (dirname, options = {}) => {
  const {
    schemaPath,
    files = ["src/**/*.{js,mjs,ts,mts,jsx,tsx}"],
    ignores = ["node_modules/**", "dist/**"],
  } = options;

  const graphQLConfig = {
    schema: schemaPath,
    documents: [`${dirname}/src/**/*.{js,mjs,ts,mts,jsx,tsx}`],
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

  const baseConfig = createBaseConfig({ ignores, files });

  return tseslint.config(
    ...baseConfig,
    {
      files,
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
        "@graphql-eslint/alphabetize": [
          "error",
          { selections: ["OperationDefinition", "FragmentDefinition"] },
        ],
        "@graphql-eslint/no-anonymous-operations": "error",
      },
    },
  );
};

/**
 * Creates GraphQL ESLint configuration for server-side schema.
 * Use this for GraphQL server projects.
 *
 * @param {string} dirname - The directory path (__dirname)
 * @param {Object} options - Configuration options
 * @param {string[]} [options.files] - File patterns for source files
 * @param {string[]} [options.ignores] - Patterns to ignore
 * @returns {import('typescript-eslint').ConfigArray}
 */
export const createGraphQLServerConfig = (dirname, options = {}) => {
  const { files = ["src/**/*.{js,mjs,ts,mts}"], ignores = ["node_modules/**", "dist/**"] } =
    options;

  const baseConfig = createBaseConfig({ ignores, files });

  return tseslint.config(...baseConfig);
};

export default createGraphQLServerConfig;
