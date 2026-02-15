/**
 * Storybook のストーリー情報を取得するユーティリティ
 */

import type { Page } from "@playwright/test";

export type StoryEntry = {
  id: string;
  title: string;
  name: string;
  importPath: string;
  tags?: string[];
  parameters?: {
    playwright?: {
      skip?: boolean;
    };
    [key: string]: unknown;
  };
};

export type StorybookIndex = {
  v: number;
  entries: Record<string, StoryEntry>;
};

/**
 * Storybook の index.json からストーリー一覧を取得
 */
export async function getStories(baseURL: string): Promise<StoryEntry[]> {
  const response = await fetch(`${baseURL}/index.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stories: ${response.statusText}`);
  }

  const index: StorybookIndex = await response.json();
  return Object.values(index.entries);
}

/**
 * VRT テスト対象のストーリーをフィルタリング
 */
export function filterTestableStories(stories: StoryEntry[]): StoryEntry[] {
  return stories.filter((story) => {
    // parameters.playwright.skip が true の場合はスキップ
    if (story.parameters?.playwright?.skip === true) {
      return false;
    }

    // docs タグが付いているストーリーはスキップ
    if (story.tags?.includes("docs")) {
      return false;
    }

    return true;
  });
}

/**
 * ストーリーの URL を生成
 */
export function getStoryUrl(baseURL: string, storyId: string): string {
  return `${baseURL}/iframe.html?id=${storyId}&viewMode=story`;
}

/**
 * ストーリーに移動し、HTTP リクエストが完了するまで待機する
 * Storybook の HMR WebSocket が永続的に接続されるため、
 * Playwright 標準の waitForLoadState("networkidle") は使用できない。
 * WebSocket を除外して HTTP リクエストのみで networkidle を判定する。
 */
export const waitForStoryReady = (page: Page, url: string): Promise<void> => {
  let pending = 0;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let safetyTimer: ReturnType<typeof setTimeout> | undefined;
  let settled = false;

  return new Promise<void>((resolve) => {
    const finish = () => {
      if (settled) return;
      settled = true;
      page.off("request", onRequest);
      page.off("requestfinished", onRequestDone);
      page.off("requestfailed", onRequestDone);
      if (idleTimer) clearTimeout(idleTimer);
      if (safetyTimer) clearTimeout(safetyTimer);
      resolve();
    };

    const checkIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (pending <= 0) {
        idleTimer = setTimeout(finish, 500);
      }
    };

    const onRequest = (req: { resourceType: () => string }) => {
      if (req.resourceType() !== "websocket") {
        pending++;
        if (idleTimer) clearTimeout(idleTimer);
      }
    };

    const onRequestDone = () => {
      pending--;
      checkIdle();
    };

    safetyTimer = setTimeout(finish, 10_000);

    // ナビゲーション前にリスナーを設定し、すべてのリクエストを捕捉する
    page.on("request", onRequest);
    page.on("requestfinished", onRequestDone);
    page.on("requestfailed", onRequestDone);

    page.goto(url).then(() => checkIdle());
  });
};
