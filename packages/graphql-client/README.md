# @curio/graphql-client

Internal GraphQL client library for Curio applications.

## Features

- **Apollo Client** integration with authentication
- **gql.tada** for type-safe GraphQL queries
- Reusable across multiple apps

## Usage

### 1. Create Apollo Client

```typescript
import { createGraphQLClient } from "@curio/graphql-client";

const apolloClient = createGraphQLClient({
  uri: "http://localhost:3000/graphql",
  headers: {
    "X-Test-Key": "test-key",
  },
});
```

### 2. Setup Apollo Provider

```typescript
import { ApolloProvider } from "@curio/graphql-client";
import { apolloClient } from "./lib/apollo-client";

const App = () => (
  <ApolloProvider client={apolloClient}>
    {/* Your app components */}
  </ApolloProvider>
);
```

### 3. Define and Use Queries with gql.tada

```typescript
import { graphql, useQuery } from "@curio/graphql-client";

const GET_BOOKMARKS = graphql(`
  query GetBookmarks {
    bookmarks {
      id
      title
      url
    }
  }
`);

const BookmarksList = () => {
  const { data, loading, error } = useQuery(GET_BOOKMARKS);
  // ...
};
```

## Exports

### Client Creation
- `createGraphQLClient(config)` - Factory function to create Apollo Client

### Apollo Client Hooks
- `useQuery` / `useSuspenseQuery` / `useLazyQuery` - Execute GraphQL queries
- `useMutation` - Execute GraphQL mutations
- `useSubscription` - Subscribe to GraphQL subscriptions
- `ApolloProvider` - Apollo Client provider component

### gql.tada
- `graphql` - Tagged template for type-safe GraphQL queries
- `readFragment` - Read fragment data
- `ResultOf<T>` / `VariablesOf<T>` / `FragmentOf<T>` - Type utilities

## Development

```bash
pnpm codegen    # Generate gql.tada output types from schema
pnpm build      # Build the library
pnpm typecheck  # TypeScript type checking
pnpm lint       # ESLint linting
```

The GraphQL schema (`src/graphql/schema.graphql`) is copied from `apps/graphql` during codegen. gql.tada uses this schema to provide compile-time type safety for all GraphQL operations.
