# GraphQL API Server

## Development Setup

### Prerequisites
- Node.js (>=22)
- pnpm

### Installation
```bash
pnpm install
```

### Database Setup

#### Development Database
```bash
# Start local SQLite dev database
pnpm db:local

# Generate Drizzle migrations
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
- `pnpm deploy` - Build and deploy to Cloudflare Workers
- `pnpm test` - Run tests
- `pnpm test:changed` - Run tests for files changed since main
- `pnpm typecheck` - TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm codegen` - Build and generate GraphQL schema for client
- `pnpm db:local` - Start local SQLite dev database
- `pnpm db:push` - Push schema to database
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio UI
- `pnpm generate:openapi` - Generate types from Qiita OpenAPI spec
- `pnpm scaffold` - Code generation via scaffdog

## Architecture

本プロジェクトはClean Architectureの原則に従って設計されており、責務を明確に分離しています。

### ディレクトリ構造と各ディレクトリの役割

```
src/
  index.ts              # Cloudflare Workers エントリポイント
                        #   → server (GraphQL) と scheduled (batch) を export
  server.ts             # GraphQL リゾルバー定義
                        #   → 全 Query / Mutation を withAuth でラップして登録
  middleware/           # 認証ミドルウェア
  application/          # ユースケース層（エンティティ × query/mutation ごとに分割）
  domain/               # ドメイン層（モデル / インターフェース / リポジトリ実装）
  shared/               # 横断的な共有モジュール
  libs/                 # テスト専用ユーティリティ
  batch/                # スケジューラ（RSS フィード定期取得）
  generated/            # 自動生成コード（GQty スキーマ）
```

#### `middleware/`

| ファイル | 役割 |
|---|---|
| `auth.ts` | `withAuth` HOF。本番では Clerk JWT を検証し、開発/テストでは `X-Test-Key` ヘッダーでバイパス。認証済み userId を `ContextRepository` に保存する |

**依存先**: `@clerk/backend` / `shared/context`

---

#### `application/`

ユースケース層。エンティティ単位のディレクトリ下に `queries/` と `mutations/` を配置。
各ユースケースは `BaseApplication<TInput, TOutput>` 型（`application/base.ts`）に従い `invoke()` を実装する。

```
application/
  base.ts                            # BaseApplication<TInput, TOutput> 型定義
  article/queries/
    get-articles/                    # Qiita 記事一覧取得
    get-recent-articles/             # Qiita 最新記事取得
  bookmark/
    queries/
      get-bookmarks/                 # ブックマーク一覧
      get-archived-bookmarks/        # アーカイブ済みブックマーク一覧
      get-bookmark/                  # ブックマーク単件取得
    mutations/
      create-bookmark/               # ブックマーク作成
      update-bookmark/               # ブックマーク更新
      archive-bookmark/              # アーカイブ
      unarchive-bookmark/            # アーカイブ解除
      delete-bookmark/               # 削除
  tag/
    queries/get-tags/                # タグ一覧
    mutations/create-tag/            # タグ作成
  rss-feed/
    queries/
      get-rss-feeds/                 # RSS フィード一覧
      get-rss-articles/              # RSS フィードから取得した記事一覧
    mutations/
      create-rss-feed/               # RSS フィード登録（フィード作成 + 初回記事取得）
      delete-rss-feed/               # RSS フィード削除
  url-metadata/
    queries/fetch-url-metadata/      # URL のメタデータ取得（og: / twitter: / title）
```

各 `index.ts`（実装）と `test.ts`（テスト）をコロケーション配置。

**依存先**: `domain/{entity}/interface.ts` / `shared/context` / `shared/drizzle`（トランザクション）

---

#### `domain/`

ドメイン層。エンティティごとに以下のファイル構成を取る。

```
domain/{entity}/
  model.ts                 # ドメインモデルの型定義
  interface.ts             # リポジトリインターフェース（抽象）
  repository.persistence.ts  # DB 実装（Drizzle ORM / Turso SQLite）
  repository.external.ts     # 外部 API 実装（外部連携があるエンティティのみ）
```

| エンティティ | persistence | external | 外部連携先 |
|---|---|---|---|
| `bookmark` | ○ | − | − |
| `tag` | ○ | − | − |
| `article` | ○ | ○ | Qiita API（OpenAPI クライアント）|
| `rss-feed` | ○ | ○ | RSS/Atom フィード（fetch + 独自 XML パーサー）|
| `url-metadata` | − | ○ | HTML スクレイピング（fetch）|

**依存先（persistence）**: `shared/drizzle/schema` / `shared/context`（userId）/ `drizzle-orm`
**依存先（external）**: `shared/openapi`（article のみ）/ `fetch`

---

#### `shared/`

横断的な共有モジュール。どの層からも参照される。

| パス | 役割 |
|---|---|
| `shared/context/index.ts` | `ContextRepository` — Pylon の `getContext` を使い userId をリクエストスコープで管理 |
| `shared/drizzle/index.ts` | `DrizzleRepository` シングルトン — DB クライアント（Turso / ローカル SQLite）の生成と提供 |
| `shared/drizzle/schema.ts` | Drizzle ORM テーブル定義（`bookmarks` / `tags` / `bookmark_tags` / `rss_feeds` / `articles`）|
| `shared/drizzle/migrations/` | Drizzle マイグレーションファイル |
| `shared/openapi/client.ts` | Qiita API の型安全 fetch クライアント（`openapi-fetch` ベース）|
| `shared/openapi/generated/` | `pnpm generate:openapi` で生成した Qiita OpenAPI 型定義 |

**依存先**: `@libsql/client` / `drizzle-orm` / `openapi-fetch`

---

#### `libs/`

| パス | 役割 |
|---|---|
| `libs/test/authHelper.ts` | テスト用認証ヘッダー生成ヘルパー |
| `libs/test/client.ts` | GraphQL テストクライアント（Pylon アプリに直接リクエストを送る）|
| `libs/test/mockServer.ts` | MSW を使った外部 API モックサーバー |
| `libs/test/globalSetup.ts` | Vitest グローバルセットアップ |
| `libs/test/vitest.setup.ts` | Vitest テストファイル単位のセットアップ |

**依存先**: `msw` / `vitest`（テスト専用。プロダクションコードからは参照しない）

---

#### `batch/`

| ファイル | 役割 |
|---|---|
| `batch/index.ts` | Cloudflare Workers `scheduled` イベントハンドラー。全ユーザーの RSS フィードを横断して記事を取得し upsert する |

**依存先**: `domain/rss-feed/repository.persistence` / `domain/rss-feed/repository.external` / `domain/article/repository.persistence` / `shared/drizzle` / `shared/context`

---

#### `generated/`

`pnpm codegen`（GQty）で自動生成されるファイル群。手動編集しない。

---

### 依存関係図

```
index.ts
  ├── server.ts
  │     ├── middleware/auth.ts
  │     │     └── shared/context
  │     └── application/**
  │           ├── domain/**/interface.ts
  │           ├── shared/context
  │           └── shared/drizzle  (transaction)
  └── batch/index.ts
        ├── domain/rss-feed/repository.persistence
        ├── domain/rss-feed/repository.external
        ├── domain/article/repository.persistence
        ├── shared/context
        └── shared/drizzle

domain/**/repository.persistence.ts
  ├── shared/drizzle/schema
  ├── shared/context          (userId)
  └── drizzle-orm

domain/article/repository.external.ts
  └── shared/openapi/client   (Qiita API)

domain/rss-feed/repository.external.ts
  └── fetch                   (RSS/Atom XML)

domain/url-metadata/repository.external.ts
  └── fetch                   (HTML scraping)
```

依存の方向: `shared` / `domain` ← `application` ← `middleware` ← `server.ts` ← `index.ts`

---

### 設計の特徴

1. **Clean Architecture**: domain / application / middleware / shared の明確な層分離
2. **エンティティ単位の整理**: application 層・domain 層ともにエンティティ単位でディレクトリを構成
3. **コロケーション**: 各 query/mutation にテストファイルを同梱し、関連ファイルを近くに配置
4. **TypeScript 関数ベース**: クラスではなくアロー関数を使用したシンプルな実装
5. **`type` 定義**: `interface` ではなく `type` を使用（Biome ルール準拠）
6. **リポジトリパターン**: ドメイン層でインターフェースを定義し、永続化 / 外部 API 実装を同梱

## Database Schema

SQLite（本番: Turso、開発: ローカルSQLite）を使用。スキーマは Drizzle ORM で定義（`src/shared/drizzle/schema.ts`）。

### bookmarks
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY (cuid2) |
| user_id | TEXT | NOT NULL |
| title | TEXT | NOT NULL |
| url | TEXT | NOT NULL |
| description | TEXT | |
| note | TEXT | |
| thumbnail | TEXT | |
| created_at | TEXT | NOT NULL, DEFAULT datetime('now') |
| updated_at | TEXT | NOT NULL, DEFAULT datetime('now') |

UNIQUE制約: `(user_id, url)`

### tags
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY (cuid2) |
| user_id | TEXT | NOT NULL |
| name | TEXT | NOT NULL |
| created_at | TEXT | NOT NULL, DEFAULT datetime('now') |
| updated_at | TEXT | NOT NULL, DEFAULT datetime('now') |

UNIQUE制約: `(user_id, name)`

### bookmark_tags
| Column | Type | Constraints |
|--------|------|-------------|
| bookmark_id | TEXT | NOT NULL, FK → bookmarks.id (CASCADE DELETE) |
| tag_id | TEXT | NOT NULL, FK → tags.id (CASCADE DELETE) |

PRIMARY KEY: `(bookmark_id, tag_id)`

### rss_feeds
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY (cuid2) |
| user_id | TEXT | NOT NULL |
| url | TEXT | NOT NULL |
| title | TEXT | NOT NULL |
| description | TEXT | |
| created_at | TEXT | NOT NULL, DEFAULT datetime('now') |
| updated_at | TEXT | NOT NULL, DEFAULT datetime('now') |

UNIQUE制約: `(user_id, url)`

### articles
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY (cuid2) |
| user_id | TEXT | NOT NULL |
| rss_feed_id | TEXT | NOT NULL, FK → rss_feeds.id (CASCADE DELETE) |
| title | TEXT | NOT NULL |
| url | TEXT | NOT NULL |
| description | TEXT | |
| thumbnail_url | TEXT | |
| pub_date | TEXT | |
| created_at | TEXT | NOT NULL, DEFAULT datetime('now') |
| updated_at | TEXT | NOT NULL, DEFAULT datetime('now') |

UNIQUE制約: `(rss_feed_id, url)`
