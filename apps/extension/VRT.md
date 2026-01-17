# Visual Regression Testing (VRT)

このプロジェクトでは、Playwright と Storybook を活用したローカル VRT 環境を構築しています。

## セットアップ

1. 依存関係をインストール:

```bash
pnpm install
```

2. Playwright のブラウザをインストール:

```bash
pnpm exec playwright install chromium
```

## 使い方

### 初回実行（ベースラインスクリーンショット作成）

最初にベースラインとなるスクリーンショットを作成します:

```bash
pnpm vrt:update
```

これにより、`tests/vrt/__screenshots__/` ディレクトリにスクリーンショットが保存されます。

### VRT テスト実行

変更後に VRT テストを実行して、視覚的な変更を検出します:

```bash
pnpm vrt
```

### スクリーンショット更新

意図的な変更を加えた場合は、ベースラインを更新します:

```bash
pnpm vrt:update
```

## テスト対象の制御

### ストーリーを VRT から除外する

特定のストーリーを VRT テストから除外したい場合は、`parameters.playwright.skip` を使用します:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta = {
  component: MyComponent,
  parameters: {
    playwright: {
      skip: true, // この ストーリーを VRT から除外
    },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

## 仕組み

1. **動的なストーリー取得**: `http://localhost:6006/index.json` から Storybook のストーリー一覧を取得
2. **フィルタリング**: `parameters.playwright.skip` が `true` のストーリーや `docs` タグが付いたストーリーを除外
3. **スクリーンショット撮影**: 各ストーリーに対して、デスクトップ・モバイルの各ビューポートでスクリーンショットを撮影
4. **比較**: 前回のスクリーンショットと比較して差分を検出

## ビューポート

デフォルトで以下のビューポートでテストを実行します:

- Desktop: 1280x720
- Mobile: 375x667

ビューポートを追加・変更する場合は、`tests/vrt/storybook.spec.ts` を編集してください。

## トラブルシューティング

### テストが失敗する場合

1. Storybook が起動していることを確認してください（`pnpm storybook`）
2. スクリーンショットの差分を確認してください（`playwright-report/index.html`）
3. 意図的な変更の場合は、ベースラインを更新してください（`pnpm vrt:update`）

### Storybook が自動起動しない場合

VRT テストは自動的に Storybook を起動しますが、既に起動している場合は再利用します。
手動で起動する場合:

```bash
pnpm storybook
```

別のターミナルで:

```bash
pnpm vrt
```
