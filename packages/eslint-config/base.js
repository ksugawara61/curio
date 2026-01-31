import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import tseslint from "typescript-eslint";

/**
 * Base ESLint configuration for TypeScript projects.
 * Includes TypeScript support and prefer-arrow-functions rule.
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.tsconfigRootDir] - The root directory for TypeScript config resolution
 * @param {string[]} [options.ignores] - Patterns to ignore
 * @param {string[]} [options.files] - File patterns to lint
 * @returns {import('typescript-eslint').ConfigArray}
 */
export const createBaseConfig = (options = {}) => {
  const {
    tsconfigRootDir,
    ignores = ["node_modules/**", "dist/**"],
    files = ["src/**/*.{js,mjs,ts,mts,jsx,tsx}"]
  } = options;

  return tseslint.config(
    {
      ignores,
    },
    {
      files,
      extends: [tseslint.configs.base],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      plugins: {
        "prefer-arrow-functions": preferArrowFunctions,
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
      },
    },
  );
};

export default createBaseConfig;
