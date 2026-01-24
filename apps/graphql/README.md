# GraphQL API Server

## Development Setup

### Prerequisites
- Node.js (>=18)
- pnpm
- Docker & Docker Compose

### Installation
```bash
pnpm install
```

### Database Setup

#### Development Database
```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate
```


### Authentication

このAPIは Clerk による認証を使用しています。すべてのGraphQLクエリとミューテーションには、有効な認証トークンが必要です。

#### 本番環境

本番環境では、`Authorization` ヘッダーに有効な Clerk JWT トークンを含める必要があります：

```
Authorization: Bearer <clerk-jwt-token>
```

#### 開発/テスト環境

開発環境（`NODE_ENV=development`）またはテスト環境（`NODE_ENV=test`）では、認証をバイパスできます。以下のヘッダーを含めることで、Clerk認証なしでAPIを使用できます：

```
X-Test-Key: <TEST_AUTH_KEY環境変数の値>
X-Test-User-Id: <任意のユーザーID>  # オプション（デフォルト: "test-user"）
```

**環境変数の設定例：**

```bash
# .env.local
NODE_ENV=development
TEST_AUTH_KEY=your-test-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

**セキュリティ上の注意：**
- `TEST_AUTH_KEY` は本番環境では設定しないでください
- テストキー機能は `NODE_ENV=production` では動作しません

### Running Tests

```bash
pnpm test
```

テストでは、自動的に認証モックが適用されるため、個別に認証ヘッダーを設定する必要はありません。

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm db:migrate` - Run database migrations (development)
- `pnpm db:generate` - Generate Prisma client
- `pnpm lint` - Run linting
- `pnpm fmt` - Format code

## Architecture

本プロジェクトはClean Architectureの原則に従って設計されており、責務を明確に分離しています。

### ディレクトリ構造と依存関係

```mermaid
graph TD
    %% Layers
    subgraph "Interface Layer"
        Server[server.ts]
    end

    subgraph "Application Layer"
        Articles[application/articles]
        Bookmarks[application/bookmarks]
    end

    subgraph "Infrastructure Layer"
        Domain[infrastructure/domain<br/>Article.ts, Bookmark.ts]
        External[infrastructure/external<br/>ArticleRepository.ts]
        Persistence[infrastructure/persistence<br/>BookmarkRepository.ts]
        ExternalAPIs[External APIs<br/>Qiita API, Prisma]
    end

    %% Dependencies
    Server --> Articles
    Server --> Bookmarks
    Articles --> Domain
    Bookmarks --> Domain
    Articles --> External
    Bookmarks --> Persistence
    External --> ExternalAPIs
    Persistence --> ExternalAPIs

    %% Styling
    classDef interface fill:#e1f5fe
    classDef application fill:#f3e5f5
    classDef infrastructure fill:#fff3e0

    class Server interface
    class Articles,Bookmarks application
    class Domain,External,Persistence,ExternalAPIs infrastructure
```

### 各層の責務

#### Application Layer (`src/application/`)
- **Use Cases**: ビジネスロジックとユースケースの実装
  - `articles/FetchArticlesUseCase.ts`: 記事取得ユースケース
  - `bookmarks/`: ブックマークのCRUD操作
    - `CreateBookmarkUseCase.ts`
    - `FetchBookmarksUseCase.ts`
    - `FetchBookmarkByIdUseCase.ts`
    - `UpdateBookmarkUseCase.ts`
    - `DeleteBookmarkUseCase.ts`

#### Infrastructure Layer (`src/infrastructure/`)
- **Domain**: エンティティ定義（簡略化のためinfrastructure層に配置）
  - `domain/Article.ts`: 記事エンティティ
  - `domain/Bookmark.ts`: ブックマークエンティティ
- **External**: 外部API連携実装
  - `external/ArticleRepository.ts`: Qiita API連携
- **Persistence**: データベース連携実装
  - `persistence/BookmarkRepository.ts`: Prisma DB連携

#### Interface Layer (`src/`)
- **Server**: GraphQLリゾルバーの直接実装
  - `server.ts`: 各ユースケースを直接呼び出すシンプルな構成

### 設計の特徴

1. **TypeScript関数ベース**: クラスではなく関数を使用したシンプルな実装
2. **type定義**: interfaceではなくtype定義を使用
3. **シンプルな構造**: 複雑な抽象化を避け、理解しやすい構成
4. **責任の分離**: 外部API（external）とDB（persistence）の明確な分離
5. **直接的な依存**: ユースケースからrepositoryへの直接インポート

## Database Schema

The application uses Prisma ORM with SQLite. The database schema is defined in `prisma/schema.prisma`.

### Bookmarks Model
```prisma
model Bookmark {
  id          String   @id @default(cuid())
  title       String
  url         String
  description String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  @@map("bookmarks")
}
```