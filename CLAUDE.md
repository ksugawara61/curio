# CLAUDE.md

## Project Overview

Curio is a browser extension for bookmarking and browsing articles (Qiita integration). It's a full-stack monorepo with a React Chrome extension frontend and a Cloudflare Workers GraphQL API backend.

## Monorepo Structure

```
apps/
  extension/       # Chrome extension (React 19, Vite, TailwindCSS + DaisyUI)
  graphql/         # GraphQL API (Pylon on Cloudflare Workers, Drizzle ORM, Turso/SQLite)
packages/
  graphql-client/  # Shared Apollo Client + gql.tada type-safe queries
  eslint-config/   # Shared ESLint configs (base, react, testing, graphql)
  testing-library/ # Shared test utilities (custom render, MSW helpers)
```

## Tech Stack

- **Package manager**: pnpm 10.29.2 (strict catalog mode)
- **Build orchestration**: Turborepo 2.8.0
- **Node**: v22.22.0
- **Language**: TypeScript 5.9 (strict mode)
- **Formatting/Linting**: Biome 2.3 + ESLint 9
- **Git hooks**: Lefthook (pre-commit: biome check + eslint, pre-push: staged file check)

## Common Commands

```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages
pnpm test         # Run all tests (Vitest)
pnpm typecheck    # TypeScript checking
pnpm lint         # Biome + ESLint
pnpm fmt          # Auto-format with Biome
pnpm codegen      # GraphQL schema codegen + format
```

### Extension-specific

```bash
cd apps/extension
pnpm storybook    # Component dev server (port 6006)
pnpm vrt          # Visual regression tests (Playwright)
pnpm vrt:approve  # Update VRT baselines
```

### GraphQL API-specific

```bash
cd apps/graphql
pnpm dev              # Dev server (port 3000)
pnpm deploy           # Deploy to Cloudflare Workers
pnpm db:local         # Local SQLite dev database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Drizzle Studio UI
pnpm generate:openapi # Generate types from Qiita OpenAPI spec
pnpm scaffold         # Code generation via scaffdog
```

## Code Conventions

- **Files**: kebab-case (`bookmark-check.tsx`)
- **Components**: PascalCase (`BookmarkCheck`)
- **Functions**: Arrow functions preferred (enforced by ESLint)
- **Types**: Use `type` not `interface` (Biome rule)
- **No non-null assertions** (`!`) unless justified
- **Co-located files**: Components alongside their `.test.tsx`, `.mocks.ts`, `.stories.tsx`

## Architecture

### Backend (apps/graphql) — Clean Architecture

```
src/
  server.ts              # GraphQL resolvers (entry point)
  middleware/             # Auth middleware (Clerk / test key)
  application/           # Use cases organized by entity
    {entity}/queries/    #   e.g. bookmark/queries/get-bookmarks/
    {entity}/mutations/  #   e.g. bookmark/mutations/create-bookmark/
  domain/                # Domain layer organized by entity
    {entity}/model.ts          # Entity type definitions
    {entity}/interface.ts      # Repository interface
    {entity}/repository.*.ts   # Repository implementations (persistence / external)
  shared/context/        # User context management (Pylon getContext)
  libs/
    drizzle/             # DB client, schema, migrations
    openapi/             # Qiita API client
    test/                # Test utilities (auth helper, MSW mock server)
```

### Frontend (apps/extension)

```
src/
  pages/              # HTML entry points (popup, sidepanel)
  features/           # Feature modules organized by page/tab
    popup/            #   e.g. Popup feature
    sidepanel/        #   e.g. SidePanel tabs (bookmark-check, bookmark-list, article-list, settings)
    shared/graphql/   #   Shared GraphQL queries/mutations
  shared/             # Shared components, hooks, providers
  libs/               # SWR config, test utilities (MSW, Clerk mock)
```

- React 19 with Suspense for data loading
- Apollo Client + gql.tada for type-safe GraphQL queries
- React Hook Form + Zod for form validation
- MSW for API mocking in tests and Storybook

## Database

SQLite (Turso in production, local SQLite for dev) with three tables:
- `bookmarks` — id (cuid2), user_id, title, url, description, note, thumbnail, timestamps. UNIQUE: (user_id, url)
- `tags` — id (cuid2), user_id, name, timestamps. UNIQUE: (user_id, name)
- `bookmark_tags` — junction table (bookmark_id, tag_id) with cascade deletes

## Testing

- **Unit tests**: Vitest + Testing Library (jsdom for extension, node for graphql)
- **API mocking**: MSW handlers
- **VRT**: Playwright against Storybook stories
- **Test helpers**: Use `@curio/testing-library` package (`render`, `renderSuspense`, `createMockQuery`, etc.)

## Authentication

- **Production**: Clerk JWT in `Authorization` header
- **Dev/Test**: `X-Test-Key` header with `TEST_AUTH_KEY` env var (bypasses Clerk)

## CI

GitHub Actions runs on PRs and pushes to main: test, lint, typecheck, VRT, GraphQL deploy, and migration deploy workflows.
