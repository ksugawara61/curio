# Scaffdog Templates for GraphQL Application Layer

このディレクトリには、GraphQLアプリケーション層のコードを生成するためのscaffdogテンプレートが含まれています。

## 利用可能なテンプレート

### Queries

#### 1. collection-query
複数のアイテムを返すクエリを生成します（例: `bookmarks`, `articles`）。

**生成されるファイル:**
- `src/application/queries/{name}/index.ts` - クエリの実装
- `src/application/queries/{name}/test.ts` - テストファイル

**必要な入力:**
- `name`: クエリ名（例: bookmarks, articles）
- `domain`: ドメインタイプ名（例: Bookmark, Article）
- `repository`: リポジトリ名（例: BookmarkRepository, ArticleRepository）

#### 2. single-query
単一のアイテムを返すクエリを生成します（例: `bookmark`, `article`）。

**生成されるファイル:**
- `src/application/queries/{name}/index.ts` - クエリの実装
- `src/application/queries/{name}/test.ts` - テストファイル

**必要な入力:**
- `name`: クエリ名（例: bookmark, article）
- `domain`: ドメインタイプ名（例: Bookmark, Article）
- `repository`: リポジトリ名（例: BookmarkRepository, ArticleRepository）

### Mutations

#### 3. create-mutation
新しいアイテムを作成するミューテーションを生成します（例: `createBookmark`, `createTag`）。

**生成されるファイル:**
- `src/application/mutations/{name}/index.ts` - ミューテーションの実装
- `src/application/mutations/{name}/test.ts` - テストファイル

**必要な入力:**
- `name`: ミューテーション名（例: createBookmark, createTag）
- `domain`: ドメインタイプ名（例: Bookmark, Tag）
- `inputType`: 入力タイプ名（例: CreateBookmarkInput, CreateTagInput）
- `repository`: リポジトリ名（例: BookmarkRepository, TagRepository）

#### 4. update-mutation
既存のアイテムを更新するミューテーションを生成します（例: `updateBookmark`, `updateTag`）。

**生成されるファイル:**
- `src/application/mutations/{name}/index.ts` - ミューテーションの実装
- `src/application/mutations/{name}/test.ts` - テストファイル

**必要な入力:**
- `name`: ミューテーション名（例: updateBookmark, updateTag）
- `domain`: ドメインタイプ名（例: Bookmark, Tag）
- `inputType`: 入力タイプ名（例: UpdateBookmarkInput, UpdateTagInput）
- `repository`: リポジトリ名（例: BookmarkRepository, TagRepository）

#### 5. delete-mutation
アイテムを削除するミューテーションを生成します（例: `deleteBookmark`, `deleteTag`）。

**生成されるファイル:**
- `src/application/mutations/{name}/index.ts` - ミューテーションの実装
- `src/application/mutations/{name}/test.ts` - テストファイル

**必要な入力:**
- `name`: ミューテーション名（例: deleteBookmark, deleteTag）
- `domain`: ドメインタイプ名（例: Bookmark, Tag）
- `repository`: リポジトリ名（例: BookmarkRepository, TagRepository）
- `deleteMethod`: リポジトリの削除メソッド名（例: deleteBookmark, deleteTag）

## 使い方

### テンプレート一覧を表示

```bash
pnpm scaffold:list
```

### コードを生成

```bash
pnpm scaffold
```

インタラクティブなプロンプトに従って、テンプレートを選択し、必要な情報を入力します。

### 使用例

#### 例1: コレクションクエリの生成

```bash
pnpm scaffold
# テンプレート選択: collection-query
# name: users
# domain: User
# repository: UserRepository
```

生成されるファイル:
- `src/application/queries/users/index.ts`
- `src/application/queries/users/test.ts`

#### 例2: 作成ミューテーションの生成

```bash
pnpm scaffold
# テンプレート選択: create-mutation
# name: createUser
# domain: User
# inputType: CreateUserInput
# repository: UserRepository
```

生成されるファイル:
- `src/application/mutations/createUser/index.ts`
- `src/application/mutations/createUser/test.ts`

## 生成後の作業

コード生成後、以下の作業が必要です：

1. **ドメインモデルとリポジトリの実装を確認**
   - 生成されたコードが参照しているドメインモデルとリポジトリが存在することを確認
   - 存在しない場合は、先にinfrastructure層の実装を完了させる

2. **テストデータの追加**
   - `test.ts`ファイルの `// TODO` コメントを確認
   - 実際のテストデータを追加してテストを完成させる

3. **GraphQLスキーマへの登録**
   - 生成したqueryまたはmutationをGraphQLスキーマに登録
   - `src/index.ts`でexportし、GraphQL APIとして公開

4. **型の調整**
   - 必要に応じて、入力パラメータや戻り値の型を調整
   - より詳細なバリデーションやビジネスロジックを追加

## アーキテクチャパターン

生成されるコードは、以下のクリーンアーキテクチャパターンに従っています：

### Queries
- トランザクションを使用しない（読み取り専用）
- リポジトリを直接インスタンス化
- エラーハンドリングは`ServiceError`を使用

### Mutations
- `db.transaction()`でトランザクション管理
- リポジトリにトランザクションオブジェクトを渡す
- NOT_FOUND (404)とINTERNAL_ERROR (500)を適切に使い分け

### エラーハンドリング
- すべての操作は`try-catch`ブロックでラップ
- `ServiceError`で統一されたエラーレスポンス
- エラーメッセージは`Failed to [action]: [details]`形式
