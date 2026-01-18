/**
 * Storybook のストーリー情報を取得するユーティリティ
 */

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
