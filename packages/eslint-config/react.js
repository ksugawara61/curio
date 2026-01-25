import reactHooks from "eslint-plugin-react-hooks";

/**
 * React-specific ESLint configuration.
 * Includes react-hooks rules.
 *
 * @param {Object} options - Configuration options
 * @param {string[]} [options.files] - File patterns to lint
 * @returns {import('typescript-eslint').ConfigWithExtends}
 */
export const createReactConfig = (options = {}) => {
  const { files = ["src/**/*.{js,mjs,ts,mts,jsx,tsx}"] } = options;

  return {
    files,
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  };
};

export default createReactConfig;
