import testingLibrary from "eslint-plugin-testing-library";

/**
 * Testing-specific ESLint configuration.
 * Includes testing-library rules for React.
 *
 * @param {Object} options - Configuration options
 * @param {string[]} [options.files] - File patterns for test files
 * @returns {import('typescript-eslint').ConfigWithExtends}
 */
export const createTestingConfig = (options = {}) => {
  const {
    files = [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "src/**/__tests__/**/*.{ts,tsx}",
    ],
  } = options;

  return {
    files,
    plugins: {
      "testing-library": testingLibrary,
    },
    rules: {
      ...testingLibrary.configs["flat/react"].rules,
    },
  };
};

export default createTestingConfig;
