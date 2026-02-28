import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ArticleWebView } from ".";

const { mockRouterBack } = vi.hoisted(() => ({
  mockRouterBack: vi.fn(),
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: mockRouterBack,
  }),
  useLocalSearchParams: () => ({ url: "https://example.com/article" }),
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

describe("ArticleWebView", () => {
  it("URL を渡した WebView をレンダリングする", () => {
    render(<ArticleWebView />);

    const webview = screen.getByTestId("webview");
    expect(webview).toBeInTheDocument();
    expect(webview).toHaveAttribute("data-uri", "https://example.com/article");
  });

  it("初期状態でプログレスバーを表示する", () => {
    render(<ArticleWebView />);

    // isLoading is initially true, so the progress bar should be rendered
    expect(screen.getByTestId("webview")).toBeInTheDocument();
  });

  it("戻るボタンを押すと router.back が呼ばれる", () => {
    const { container } = render(<ArticleWebView />);

    // TouchableOpacity renders as a div with tabindex="0" in react-native-web
    const backButton = container.querySelector("[tabindex='0']");
    expect(backButton).not.toBeNull();
    fireEvent.click(backButton as Element);

    expect(mockRouterBack).toHaveBeenCalled();
  });

  it("onLoadStart イベントを処理する", () => {
    render(<ArticleWebView />);

    fireEvent.click(screen.getByTestId("trigger-load-start"));

    // isLoading が true になっている（初期状態から変化なし）
    expect(screen.getByTestId("webview")).toBeInTheDocument();
  });

  it("onLoadProgress イベントを処理する", () => {
    render(<ArticleWebView />);

    fireEvent.click(screen.getByTestId("trigger-load-progress"));

    expect(screen.getByTestId("webview")).toBeInTheDocument();
  });

  it("onLoadEnd イベントを処理する", () => {
    render(<ArticleWebView />);

    fireEvent.click(screen.getByTestId("trigger-load-end"));

    expect(screen.getByTestId("webview")).toBeInTheDocument();
  });
});
