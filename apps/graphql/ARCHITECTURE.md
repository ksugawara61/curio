# GraphQL アーキテクチャ

このプロジェクトは、ライトなクリーンアーキテクチャの構成で実装されています。

## ディレクトリ構造

```
apps/graphql/src/
├── schema/                    # GraphQL スキーマ層
│   ├── schema.graphql        # GraphQL スキーマ定義
│   └── generated/            # 自動生成ファイル
│       └── graphql.ts        # GraphQL Codegen による型定義
├── application/               # Application 層（ユースケース）
│   ├── queries/              # クエリのユースケース
│   │   └── hello/
│   │       ├── hello.usecase.ts
│   │       └── hello.usecase.test.ts
│   └── mutations/            # ミューテーションのユースケース
├── infrastructure/            # Infrastructure 層
│   ├── database/             # データベースアクセス
│   ├── external-api/         # 外部APIクライアント
│   └── file-storage/         # ファイルストレージ
├── server.ts                 # Apollo Server セットアップ
├── context.ts                # GraphQL コンテキスト型定義
└── index.ts                  # エントリーポイント
```

## 各層の責務

### Schema 層

GraphQL スキーマ定義と自動生成ファイルを管理します。

- `schema.graphql`: GraphQL スキーマ定義
- `generated/`: GraphQL Codegen で生成される型定義

### Application 層

ビジネスロジックを実装するユースケース層です。

**特徴：**
- Resolver に対応する処理を実装
- Input/Output は型で表現
- 同一ファイルにまとめて実装
- テストはコロケーション（同じディレクトリに配置）

**実装例：**

```typescript
// Input type
export type HelloUseCaseInput = Record<string, never>;

// Output type
export type HelloUseCaseOutput = {
  message: string;
};

// UseCase implementation
export const helloUseCase = (
  _input: HelloUseCaseInput
): HelloUseCaseOutput => {
  return {
    message: "world",
  };
};
```

**テストの書き方：**
- コロケーション: `*.usecase.test.ts` として同じディレクトリに配置
- Application 層のみをテスト対象とする
- ユニットテストで各ユースケースの動作を検証

### Infrastructure 層

データソースへのアクセスを実装する層です。

**特徴：**
- 抽象化は不要で、具体的な実装のみを定義
- データベース、外部API、ファイルシステムなどへのアクセスを実装

**実装方針：**
- 各データソース毎にディレクトリを分けて管理
- リポジトリパターンやクライアントクラスで実装

## 開発フロー

### 1. GraphQL スキーマの定義

`src/schema/schema.graphql` に GraphQL スキーマを定義します。

```graphql
type Query {
  hello: String!
}
```

### 2. 型の自動生成

```bash
npm run codegen
```

### 3. Application 層の実装

`src/application/queries/` または `src/application/mutations/` に usecase を実装します。

```typescript
// src/application/queries/hello/hello.usecase.ts
export type HelloUseCaseInput = Record<string, never>;
export type HelloUseCaseOutput = { message: string };

export const helloUseCase = (
  _input: HelloUseCaseInput
): HelloUseCaseOutput => {
  return { message: "world" };
};
```

### 4. テストの作成

同じディレクトリにテストファイルを作成します。

```typescript
// src/application/queries/hello/hello.usecase.test.ts
import { describe, expect, it } from "vitest";
import { helloUseCase } from "./hello.usecase";

describe("helloUseCase", () => {
  it("should return world message", () => {
    const result = helloUseCase({});
    expect(result.message).toBe("world");
  });
});
```

### 5. Resolver の実装

`src/server.ts` で usecase を呼び出すように resolver を実装します。

```typescript
import { helloUseCase } from "./application/queries/hello/hello.usecase";

const resolvers: Resolvers = {
  Query: {
    hello: () => {
      const result = helloUseCase({});
      return result.message;
    },
  },
};
```

## テスト戦略

### Application 層のテスト

- **対象**: すべての usecase
- **方法**: ユニットテスト
- **配置**: コロケーション（`*.usecase.test.ts`）
- **ツール**: Vitest

### Infrastructure 層のテスト

初期段階では実装しませんが、将来的には以下を検討します：
- インテグレーションテスト
- モックを使用した単体テスト

## コーディング規約

### ファイル命名規則

- UseCase: `*.usecase.ts`
- UseCase Test: `*.usecase.test.ts`
- Repository: `*.repository.ts`
- Client: `*.client.ts`

### 型命名規則

- Input: `{UseCaseName}Input`
- Output: `{UseCaseName}Output`

### ディレクトリ構造

- 機能ごとにディレクトリを分ける
- 関連するファイルは同じディレクトリに配置（コロケーション）
