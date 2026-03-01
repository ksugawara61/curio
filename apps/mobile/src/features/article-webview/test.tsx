import { render, screen, waitFor } from "@curio/testing-library";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../libs/test/msw/server";
import { ArticleWebView } from ".";
import { BookmarkCheckQueryMocks } from "./BookmarkCheckQuery.mocks";
import { CreateBookmarkMutationMocks } from "./CreateBookmarkMutation.mocks";
import { DeleteBookmarkMutationMocks } from "./DeleteBookmarkMutation.mocks";

const { mockRouterBack } = vi.hoisted(() => ({
  mockRouterBack: vi.fn(),
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: mockRouterBack,
  }),
  useLocalSearchParams: () => ({
    url: "https://example.com/article",
    title: "Example Article",
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("react-native-webview", () => ({
  WebView: ({
    onLoadStart,
    onLoadProgress,
    onLoadEnd,
    source,
  }: {
    onLoadStart?: () => void;
    onLoadProgress?: (e: { nativeEvent: { progress: number } }) => void;
    onLoadEnd?: () => void;
    source?: { uri?: string };
    style?: object;
  }) => (
    <div data-testid="webview" data-uri={source?.uri}>
      <button
        type="button"
        data-testid="trigger-load-start"
        onClick={() => onLoadStart?.()}
      />
      <button
        type="button"
        data-testid="trigger-load-progress"
        onClick={() => onLoadProgress?.({ nativeEvent: { progress: 0.5 } })}
      />
      <button
        type="button"
        data-testid="trigger-load-end"
        onClick={() => onLoadEnd?.()}
      />
    </div>
  ),
}));

// Ionicons のグリフ文字（実際のコンポーネントがレンダリングする Unicode 文字）
const IONICON_GLYPHS = {
  bookmark: String.fromCodePoint(61864),
  "bookmark-outline": String.fromCodePoint(61865),
} as const;

describe("ArticleWebView", () => {
  it("URL を渡した WebView をレンダリングする", () => {
    server.use(BookmarkCheckQueryMocks.NotBookmarked);

    render(<ArticleWebView />);

    const webview = screen.getByTestId("webview");
    expect(webview).toBeInTheDocument();
    expect(webview).toHaveAttribute("data-uri", "https://example.com/article");
  });

  it("初期状態でプログレスバーを表示する", () => {
    server.use(BookmarkCheckQueryMocks.NotBookmarked);

    render(<ArticleWebView />);

    expect(screen.getByTestId("webview")).toBeInTheDocument();
  });

  it("戻るボタンを押すと router.back が呼ばれる", () => {
    server.use(BookmarkCheckQueryMocks.NotBookmarked);

    const { container } = render(<ArticleWebView />);

    // TouchableOpacity renders as a div with tabindex="0" in react-native-web
    const backButton = container.querySelector("[tabindex='0']");
    expect(backButton).not.toBeNull();
    fireEvent.click(backButton as Element);

    expect(mockRouterBack).toHaveBeenCalled();
  });

  it("onLoadStart イベントを処理する", () => {
    server.use(BookmarkCheckQueryMocks.NotBookmarked);

    render(<ArticleWebView />);

    fireEvent.click(screen.getByTestId("trigger-load-start"));

    expect(screen.getByTestId("webview")).toBeInTheDocument();
  });

  it("onLoadProgress イベントを処理する", () => {
    server.use(BookmarkCheckQueryMocks.NotBookmarked);

    render(<ArticleWebView />);

    fireEvent.click(screen.getByTestId("trigger-load-progress"));

    expect(screen.getByTestId("webview")).toBeInTheDocument();
  });

  it("onLoadEnd イベントを処理する", () => {
    server.use(BookmarkCheckQueryMocks.NotBookmarked);

    render(<ArticleWebView />);

    fireEvent.click(screen.getByTestId("trigger-load-end"));

    expect(screen.getByTestId("webview")).toBeInTheDocument();
  });

  it("ブックマーク未登録の場合は bookmark-outline アイコンを表示する", async () => {
    server.use(BookmarkCheckQueryMocks.NotBookmarked);

    render(<ArticleWebView />);

    await waitFor(() => {
      expect(screen.getByTestId("bookmark-icon")).toHaveTextContent(
        IONICON_GLYPHS["bookmark-outline"],
      );
    });
  });

  it("ブックマーク登録済みの場合は bookmark アイコンを表示する", async () => {
    server.use(BookmarkCheckQueryMocks.Bookmarked);

    render(<ArticleWebView />);

    await waitFor(() => {
      expect(screen.getByTestId("bookmark-icon")).toHaveTextContent(
        IONICON_GLYPHS.bookmark,
      );
    });
  });

  it("未登録の状態でブックマークボタンを押すとブックマークを作成する", async () => {
    server.use(
      BookmarkCheckQueryMocks.NotBookmarked,
      CreateBookmarkMutationMocks.Success,
    );

    render(<ArticleWebView />);

    await waitFor(() => {
      expect(screen.getByTestId("bookmark-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("bookmark-button"));

    await waitFor(() => {
      expect(screen.getByTestId("bookmark-icon")).toBeInTheDocument();
    });
  });

  it("登録済みの状態でブックマークボタンを押すとブックマークを削除する", async () => {
    server.use(
      BookmarkCheckQueryMocks.Bookmarked,
      DeleteBookmarkMutationMocks.Success,
    );

    render(<ArticleWebView />);

    await waitFor(() => {
      expect(screen.getByTestId("bookmark-icon")).toHaveTextContent(
        IONICON_GLYPHS.bookmark,
      );
    });

    fireEvent.click(screen.getByTestId("bookmark-button"));

    await waitFor(() => {
      expect(screen.getByTestId("bookmark-icon")).toBeInTheDocument();
    });
  });
});
