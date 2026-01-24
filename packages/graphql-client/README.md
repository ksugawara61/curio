# @curio/graphql-client

Internal GraphQL client library for Curio applications.

## Features

- **Apollo Client** integration with authentication
- **gql.tada** for type-safe GraphQL queries
- Pre-configured queries for common operations
- Reusable across multiple apps

## Installation

```bash
pnpm add @curio/graphql-client
```

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

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      {/* Your app components */}
    </ApolloProvider>
  );
}
```

### 3. Use Queries

```typescript
import { useQuery, GET_ARTICLES } from "@curio/graphql-client";

function ArticlesList() {
  const { data, loading, error } = useQuery(GET_ARTICLES, {
    variables: {
      limit: 20,
      offset: 0,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}
```

## API

### Exports

#### Client Creation
- `createGraphQLClient(config: GraphQLClientConfig)` - Factory function to create Apollo Client

#### Apollo Client Hooks
- `useQuery` - Execute GraphQL queries
- `useLazyQuery` - Execute queries on demand
- `useMutation` - Execute GraphQL mutations
- `useSubscription` - Subscribe to GraphQL subscriptions
- `ApolloProvider` - Apollo Client provider component

#### gql.tada
- `graphql` - Tagged template for GraphQL queries
- `readFragment` - Read fragment data
- `ResultOf<T>` - Extract result type from query
- `VariablesOf<T>` - Extract variables type from query
- `FragmentOf<T>` - Extract fragment type

#### Pre-defined Queries
- `GET_ARTICLES` - Query to fetch articles

## Development

### Generate Types

```bash
pnpm codegen
```

This generates TypeScript types from the GraphQL schema.

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm typecheck
```

## Adding New Queries

1. Create a new file in `src/queries/`:

```typescript
import { graphql } from "../graphql/graphql";

export const GET_BOOKMARKS = graphql(`
  query GetBookmarks {
    bookmarks {
      id
      title
      url
    }
  }
`);
```

2. Export it from `src/index.ts`:

```typescript
export { GET_BOOKMARKS } from "./queries/bookmarks";
```

3. Rebuild the package:

```bash
pnpm build
```
