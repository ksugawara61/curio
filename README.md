# Curio

> A cabinet of curiosities - A modern web bookmarking system with GraphQL API and Chrome extension

Curio is a full-stack monorepo project that provides a powerful bookmarking system. It consists of a GraphQL API backend powered by Cloudflare Workers and a Chrome extension for managing bookmarks with integration to Qiita articles.

## Features

- 📚 **Bookmark Management**: Create, read, update, and delete bookmarks with ease
- 🔍 **Article Search**: Fetch and browse articles from Qiita
- 🔌 **Chrome Extension**: Convenient browser extension for quick bookmarking
- 🚀 **GraphQL API**: Modern, type-safe API built with Pylon
- 🌐 **Edge Deployment**: Serverless architecture on Cloudflare Workers
- 🎨 **Modern UI**: Built with React, TailwindCSS, and DaisyUI
- 🧪 **Comprehensive Testing**: Unit tests, integration tests, and visual regression tests

## Tech Stack

### Backend (`apps/graphql`)
- **Runtime**: Cloudflare Workers
- **Framework**: [Pylon](https://pylon.cronit.io/) - GraphQL framework for Cloudflare Workers
- **Database**: Turso (libSQL) with Drizzle ORM
- **API Integration**: Qiita API via OpenAPI
- **Testing**: Vitest with MSW for API mocking

### Frontend (`apps/extension`)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + DaisyUI
- **GraphQL Client**: Apollo Client with gql.tada for type-safe queries
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: 
  - Unit Tests: Vitest + Testing Library
  - Visual Regression: Playwright
  - Storybook: Component development and documentation

### Shared Packages
- `@curio/graphql-client`: Shared GraphQL client and type definitions
- `@curio/eslint-config`: Shared ESLint configuration
- `@curio/testing-library`: Shared testing utilities

### Development Tools
- **Package Manager**: pnpm with workspace support
- **Monorepo**: Turborepo for build orchestration
- **Code Quality**: Biome for linting and formatting
- **Git Hooks**: Lefthook for pre-commit checks
- **Documentation**: textlint for Japanese technical writing

## Repository Structure

```
curio/
├── apps/
│   ├── extension/       # Chrome extension
│   │   ├── src/
│   │   │   ├── core/    # Core components and logic
│   │   │   └── pages/   # Extension pages (popup, sidepanel)
│   │   ├── .storybook/  # Storybook configuration
│   │   └── tests/       # Playwright tests
│   └── graphql/         # GraphQL API server
│       ├── src/
│       │   ├── application/      # Use cases
│       │   ├── infrastructure/   # Repositories and external services
│       │   └── generated/        # Generated types (OpenAPI, GraphQL)
│       └── openapi/              # OpenAPI specifications
├── packages/
│   ├── graphql-client/  # Shared GraphQL client
│   ├── eslint-config/   # Shared ESLint config
│   └── testing-library/ # Shared testing utilities
└── scripts/             # Development scripts
```

## Getting Started

### Prerequisites

- Node.js >= 22 (v22.22.0 recommended)
- pnpm >= 10.28
- Docker (optional, for local database)

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

Start the development servers:

```bash
# Start all development servers
pnpm dev

# Or start individual apps
cd apps/graphql && pnpm dev
cd apps/extension && pnpm dev
```

### Building

Build all packages and apps:

```bash
pnpm build
```

### Testing

Run all tests:

```bash
pnpm test
```

Run tests for specific packages:

```bash
cd apps/extension && pnpm test
cd apps/graphql && pnpm test
```

## Development Workflow

### Code Quality

The project uses several tools to maintain code quality:

```bash
# Run linting
pnpm lint

# Format code
pnpm fmt

# Type checking
pnpm typecheck
```

### Database Management (GraphQL API)

```bash
cd apps/graphql

# Start local database
pnpm db:local

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

### Code Generation

```bash
# Generate GraphQL client types
pnpm codegen

# Generate OpenAPI types (GraphQL API)
cd apps/graphql && pnpm generate:openapi
```

## Available Commands

Root level commands:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all tests |
| `pnpm lint` | Run linting |
| `pnpm fmt` | Format code |
| `pnpm typecheck` | Run type checking |
| `pnpm codegen` | Generate code |
| `pnpm clean` | Clean node_modules |

## Contributing

Contributions are welcome! Please follow these steps:

1. Create your feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'feat: add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Project Architecture

This project follows Clean Architecture principles with clear separation of concerns:

- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: Data access, external APIs, and persistence
- **Interface Layer**: GraphQL resolvers and API endpoints

See [apps/graphql/README.md](apps/graphql/README.md) for detailed architecture documentation.

## License

This project is for personal use.

## Links

- [Pylon Documentation](https://pylon.cronit.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Qiita API](https://qiita.com/api/v2/docs)
