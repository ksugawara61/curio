import { expect, test } from "@playwright/test";
import {
  filterTestableStories,
  getStories,
  getStoryUrl,
} from "./utils/storybook";

const STORYBOOK_URL = "http://localhost:6006";

// ストーリー一覧を取得してテストを動的に生成
let stories: Awaited<ReturnType<typeof getStories>> = [];

test.beforeAll(async () => {
  // Storybook からストーリー一覧を取得
  const allStories = await getStories(STORYBOOK_URL);
  stories = filterTestableStories(allStories);

  console.log(
    `Found ${allStories.length} stories, ${stories.length} testable stories`,
  );
});

const viewport = { name: "sidepanel", width: 400, height: 768 };

// 各ストーリーに対して VRT テストを実行
test.describe("Visual Regression Tests", () => {
  test.describe(`${viewport.name} viewport`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
    });

    test("should match screenshots for all stories", async ({ page }) => {
      // ストーリーが取得できない場合はスキップ
      if (stories.length === 0) {
        test.skip();
        return;
      }

      for (const story of stories) {
        // ストーリーページに移動
        const storyUrl = getStoryUrl(STORYBOOK_URL, story.id);
        await page.goto(storyUrl);

        // ストーリーの読み込みを待つ
        await page.waitForLoadState("networkidle");

        // 少し待ってアニメーションなどが完了するのを待つ
        await page.waitForTimeout(500);

        // スクリーンショットを撮影して比較
        const screenshot = await page.screenshot({ fullPage: false });

        // ストーリー名をファイル名として使用
        const snapshotName = `${story.id}-${viewport.name}.png`;

        expect(screenshot).toMatchSnapshot(snapshotName, {
          maxDiffPixels: 100, // 許容する差分ピクセル数
        });

        console.log(`✓ ${story.title} - ${story.name} (${viewport.name})`);
      }
    });
  });
});
