import { render, screen, waitFor } from "@curio/testing-library";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../libs/test/msw/server";
import { RecentArticleList } from ".";
import { RecentArticlesQueryMocks } from "./RecentArticlesQuery.mocks";

describe("RecentArticleList", () => {
  it("ローディング中はインジケーターを表示する", async () => {
    server.use(RecentArticlesQueryMocks.Loading);

    render(<RecentArticleList />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("記事一覧を正しく表示する", async () => {
    server.use(RecentArticlesQueryMocks.Success);

    render(<RecentArticleList />);

    await waitFor(() => {
      expect(
        screen.getByText("React Native Web で始めるクロスプラットフォーム開発"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Vitest で React Native をテストする"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "React Native Web を使ってモバイルと Web を統一的に開発する方法を解説します。",
      ),
    ).toBeInTheDocument();
  });

  it("記事がない場合は空状態メッセージを表示する", async () => {
    server.use(RecentArticlesQueryMocks.Empty);

    render(<RecentArticleList />);

    await waitFor(() => {
      expect(screen.getByText("記事がありません")).toBeInTheDocument();
    });
  });

  it("エラー時はエラーメッセージを表示する", async () => {
    server.use(RecentArticlesQueryMocks.Error);

    render(<RecentArticleList />);

    await waitFor(() => {
      expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    });

    expect(screen.getByText("記事の取得に失敗しました")).toBeInTheDocument();
  });

  it("ヘッダーにユーザー情報と Sign out ボタンを表示する", async () => {
    server.use(RecentArticlesQueryMocks.Empty);

    render(<RecentArticleList />);

    expect(screen.getByText("Welcome!!")).toBeInTheDocument();
    // setup.ts でモックした useUser のメールアドレス
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("Sign out ボタンを押すと signOut が呼ばれる", async () => {
    server.use(RecentArticlesQueryMocks.Empty);

    render(<RecentArticleList />);

    fireEvent.click(screen.getByText("Sign out"));

    // signOut は setup.ts でモック済み（Promise.resolve()）
    await Promise.resolve();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("記事アイテムを押すと記事ページに遷移する", async () => {
    server.use(RecentArticlesQueryMocks.Success);

    const mockRouterPush = vi.fn();
    vi.spyOn(await import("expo-router"), "useRouter").mockReturnValue({
      push: mockRouterPush,
      replace: vi.fn(),
      back: vi.fn(),
    } as never);

    render(<RecentArticleList />);

    await waitFor(() => {
      expect(
        screen.getByText("React Native Web で始めるクロスプラットフォーム開発"),
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByText("React Native Web で始めるクロスプラットフォーム開発"),
    );

    expect(mockRouterPush).toHaveBeenCalledWith({
      pathname: "/article-webview",
      params: { url: "https://example.com/article-1" },
    });
  });
});
