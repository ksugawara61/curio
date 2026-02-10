# Curio

> A cabinet of curiosities - A modern web bookmarking system with GraphQL API and Chrome extension

Curio is a full-stack monorepo project that provides a powerful bookmarking system. It consists of a GraphQL API backend powered by Cloudflare Workers and a Chrome extension for managing bookmarks with integration to Qiita articles.

## Features

- Bookmark Management: Create, read, update, and delete bookmarks with tagging
- Article Search: Fetch and browse articles from Qiita
- Chrome Extension: Popup and SidePanel UI for quick bookmarking
- GraphQL API: Type-safe API built with Pylon on Cloudflare Workers
- Edge Deployment: Serverless architecture on Cloudflare Workers + Turso (SQLite)

## Tech Stack

### Backend (`apps/graphql`)
- **Runtime**: Cloudflare Workers
- **Framework**: [Pylon](https://pylon.cronit.io/) - GraphQL framework for Cloudflare Workers
- **Database**: Turso (libSQL) with Drizzle ORM
- **API Integration**: Qiita API via OpenAPI
- **Authentication**: Clerk JWT
- **Testing**: Vitest with MSW for API mocking

### Frontend (`apps/extension`)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + DaisyUI
- **GraphQL Client**: Apollo Client with gql.tada for type-safe queries
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Vitest + Testing Library, Playwright (VRT), Storybook

### Shared Packages
- `@curio/graphql-client`: Shared Apollo Client and type-safe GraphQL query definitions
- `@curio/eslint-config`: Shared ESLint configurations (base, react, testing, graphql)
- `@curio/testing-library`: Shared testing utilities (custom render, MSW helpers)

### Development Tools
- **Package Manager**: pnpm 10.29.2 (strict catalog mode)
- **Monorepo**: Turborepo for build orchestration
- **Code Quality**: Biome (formatter/linter) + ESLint
- **Git Hooks**: Lefthook (pre-commit: biome + eslint, pre-push: staged file check)
- **Documentation**: textlint for Japanese technical writing

## Repository Structure

```
curio/
├── apps/
│   ├── extension/          # Chrome extension (Popup + SidePanel)
│   │   ├── src/
│   │   │   ├── pages/         # Entry points (popup/, sidepanel/)
│   │   │   ├── features/      # Feature modules per page/tab
│   │   │   ├── shared/        # Shared components, hooks, providers
│   │   │   └── libs/          # Test utilities, SWR config
│   │   └── tests/             # Playwright VRT tests
│   └── graphql/            # GraphQL API server
│       └── src/
│           ├── application/   # Use cases (queries, mutations per entity)
│           ├── domain/        # Entities, repository interfaces & implementations
│           ├── middleware/     # Auth middleware
│           ├── shared/        # User context management
│           └── libs/          # DB client (Drizzle), API client (OpenAPI), test utils
├── packages/
│   ├── graphql-client/     # Shared GraphQL client (Apollo + gql.tada)
│   ├── eslint-config/      # Shared ESLint configs
│   └── testing-library/    # Shared testing utilities
└── .github/workflows/      # CI/CD pipelines
```

## Getting Started

### Prerequisites

- Node.js >= 22 (v22.22.0 recommended)
- pnpm >= 10.29

### Installation

1. Clone the repository:
```bash
cd curio
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# For GraphQL API
cd apps/graphql
cp .env.sample .env
# Edit .env with your configuration
```

### Development

```bash
# Start all development servers
pnpm dev

# Or start individual apps
cd apps/graphql && pnpm dev
cd apps/extension && pnpm dev
```

### Building

```bash
pnpm build
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific packages
cd apps/extension && pnpm test
cd apps/graphql && pnpm test
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all tests |
| `pnpm lint` | Run linting (Biome + ESLint) |
| `pnpm fmt` | Format code (Biome) |
| `pnpm typecheck` | Run type checking |
| `pnpm codegen` | Generate GraphQL client types |
| `pnpm clean` | Clean node_modules |

## Architecture

This project follows Clean Architecture principles. See individual README files for details:
- [apps/graphql/README.md](apps/graphql/README.md) - Backend architecture
- [apps/extension/README.md](apps/extension/README.md) - Frontend architecture

## License

This project is for personal use.

## Links

- [Pylon Documentation](https://pylon.cronit.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Qiita API](https://qiita.com/api/v2/docs)
