import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/graphql/schema.graphql',
  generates: {
    './src/graphql/introspection.json': {
      plugins: ['introspection'],
      config: {
        minify: true,
      },
    },
  },
};

export default config;
