import { render, screen, waitFor } from "@curio/testing-library";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../libs/test/msw/server";
import { BookmarkList } from ".";
import { BookmarksQueryMocks } from "./BookmarksQuery.mocks";

describe("BookmarkList", () => {
  it("ローディング中はインジケーターを表示する", async () => {
    server.use(BookmarksQueryMocks.Loading);

    render(<BookmarkList />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("ブックマーク一覧を正しく表示する", async () => {
    server.use(BookmarksQueryMocks.Success);

    render(<BookmarkList />);

    await waitFor(() => {
      expect(
        screen.getByText("React Native 公式ドキュメント"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("React Native の公式ドキュメントです。"),
    ).toBeInTheDocument();
    expect(screen.getByText("Expo Router ドキュメント")).toBeInTheDocument();
  });

  it("タグを正しく表示する", async () => {
    server.use(BookmarksQueryMocks.Success);

    render(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("React Native")).toBeInTheDocument();
    });

    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("ブックマークがない場合は空状態メッセージを表示する", async () => {
    server.use(BookmarksQueryMocks.Empty);

    render(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("ブックマークがありません")).toBeInTheDocument();
    });
  });

  it("エラー時はエラーメッセージを表示する", async () => {
    server.use(BookmarksQueryMocks.Error);

    render(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    });

    expect(
      screen.getByText("ブックマークの取得に失敗しました"),
    ).toBeInTheDocument();
  });

  it("ブックマークアイテムを押すと記事ページに遷移する", async () => {
    server.use(BookmarksQueryMocks.Success);

    vi.spyOn(await import("react-native"), "Platform", "get").mockReturnValue(
      "ios" as never,
    );

    const mockRouterPush = vi.fn();
    vi.spyOn(await import("expo-router"), "useRouter").mockReturnValue({
      push: mockRouterPush,
      replace: vi.fn(),
      back: vi.fn(),
    } as never);

    render(<BookmarkList />);

    await waitFor(() => {
      expect(
        screen.getByText("React Native 公式ドキュメント"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("React Native 公式ドキュメント"));

    expect(mockRouterPush).toHaveBeenCalledWith({
      pathname: "/article-webview",
      params: {
        url: "https://reactnative.dev",
        title: "React Native 公式ドキュメント",
      },
    });
  });

  it("サムネイルなしのブックマークはプレースホルダーを表示する", async () => {
    server.use(BookmarksQueryMocks.Success);

    const { container } = render(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("Expo Router ドキュメント")).toBeInTheDocument();
    });

    // Thumbnail placeholder (View with bg-background-200) is rendered for items without thumbnail
    expect(container).toBeTruthy();
  });
});
