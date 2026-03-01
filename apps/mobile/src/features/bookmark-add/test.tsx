import { render, screen, waitFor } from "@curio/testing-library";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../libs/test/msw/server";
import { BookmarkAdd } from ".";
import { BookmarksQueryMocks } from "./BookmarksQuery.mocks";
import { CreateBookmarkMutationMocks } from "./CreateBookmarkMutation.mocks";
import { FetchUrlMetadataQueryMocks } from "./FetchUrlMetadataQuery.mocks";

describe("BookmarkAdd", () => {
  it("URLを入力するフォームを表示する", () => {
    server.use(FetchUrlMetadataQueryMocks.Success, BookmarksQueryMocks.Empty);

    render(<BookmarkAdd />);

    expect(screen.getByText("ブックマークを追加")).toBeInTheDocument();
    expect(screen.getByText("URLを入力")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("https://example.com"),
    ).toBeInTheDocument();
    expect(screen.getByText("次へ")).toBeInTheDocument();
  });

  it("URLを入力して次へを押すとメタデータを取得してフォームを表示する", async () => {
    server.use(
      FetchUrlMetadataQueryMocks.Success,
      BookmarksQueryMocks.Empty,
      CreateBookmarkMutationMocks.Success,
    );

    render(<BookmarkAdd />);

    const urlInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(urlInput, {
      target: { value: "https://reactnative.dev" },
    });

    fireEvent.click(screen.getByText("次へ"));

    await waitFor(() => {
      expect(screen.getByText("追加する")).toBeInTheDocument();
    });

    expect(
      screen.getByDisplayValue("React Native 公式ドキュメント"),
    ).toBeInTheDocument();
    expect(screen.getByText("タイトル")).toBeInTheDocument();
  });

  it("メタデータのないURLでも空フォームが表示される", async () => {
    server.use(
      FetchUrlMetadataQueryMocks.Empty,
      BookmarksQueryMocks.Empty,
      CreateBookmarkMutationMocks.Success,
    );

    render(<BookmarkAdd />);

    const urlInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });

    fireEvent.click(screen.getByText("次へ"));

    await waitFor(() => {
      expect(screen.getByText("追加する")).toBeInTheDocument();
    });

    expect(
      screen.getByPlaceholderText("タイトルを入力..."),
    ).toBeInTheDocument();
  });

  it("タイトルが空の場合バリデーションエラーを表示する", async () => {
    server.use(
      FetchUrlMetadataQueryMocks.Empty,
      BookmarksQueryMocks.Empty,
      CreateBookmarkMutationMocks.Success,
    );

    render(<BookmarkAdd />);

    const urlInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });

    fireEvent.click(screen.getByText("次へ"));

    await waitFor(() => {
      expect(screen.getByText("追加する")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("追加する"));

    await waitFor(() => {
      expect(screen.getByText("タイトルは必須です")).toBeInTheDocument();
    });
  });

  it("フォームを送信するとブックマークが作成され前の画面に戻る", async () => {
    server.use(
      FetchUrlMetadataQueryMocks.Success,
      BookmarksQueryMocks.Empty,
      CreateBookmarkMutationMocks.Success,
    );

    const mockRouterBack = vi.fn();
    vi.spyOn(await import("expo-router"), "useRouter").mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      back: mockRouterBack,
      canGoBack: vi.fn().mockReturnValue(true),
    } as never);

    render(<BookmarkAdd />);

    const urlInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(urlInput, {
      target: { value: "https://reactnative.dev" },
    });

    fireEvent.click(screen.getByText("次へ"));

    await waitFor(() => {
      expect(screen.getByText("追加する")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("追加する"));

    await waitFor(() => {
      expect(mockRouterBack).toHaveBeenCalled();
    });
  });

  it("ブックマーク一覧がある場合は関連ブックマークとして表示する", async () => {
    server.use(
      FetchUrlMetadataQueryMocks.Empty,
      BookmarksQueryMocks.Success,
      CreateBookmarkMutationMocks.Success,
    );

    render(<BookmarkAdd />);

    const urlInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });

    fireEvent.click(screen.getByText("次へ"));

    await waitFor(() => {
      expect(screen.getByText("Expo Router ドキュメント")).toBeInTheDocument();
    });

    expect(screen.getByText("関連ブックマーク（任意）")).toBeInTheDocument();
  });

  it("ブックマークがない場合は関連付けるブックマークがありませんを表示する", async () => {
    server.use(
      FetchUrlMetadataQueryMocks.Empty,
      BookmarksQueryMocks.Empty,
      CreateBookmarkMutationMocks.Success,
    );

    render(<BookmarkAdd />);

    const urlInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });

    fireEvent.click(screen.getByText("次へ"));

    await waitFor(() => {
      expect(
        screen.getByText("関連付けるブックマークがありません"),
      ).toBeInTheDocument();
    });
  });

  it("関連ブックマークを選択するとチップとして表示される", async () => {
    server.use(
      FetchUrlMetadataQueryMocks.Empty,
      BookmarksQueryMocks.Success,
      CreateBookmarkMutationMocks.Success,
    );

    render(<BookmarkAdd />);

    const urlInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });

    fireEvent.click(screen.getByText("次へ"));

    await waitFor(() => {
      expect(screen.getByText("Expo Router ドキュメント")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Expo Router ドキュメント"));

    await waitFor(() => {
      expect(screen.getAllByText("Expo Router ドキュメント")).toHaveLength(2);
    });
  });

  it("選択済みの関連ブックマークのチップを押すと選択解除される", async () => {
    server.use(
      FetchUrlMetadataQueryMocks.Empty,
      BookmarksQueryMocks.Success,
      CreateBookmarkMutationMocks.Success,
    );

    render(<BookmarkAdd />);

    const urlInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });

    fireEvent.click(screen.getByText("次へ"));

    await waitFor(() => {
      expect(screen.getByText("Expo Router ドキュメント")).toBeInTheDocument();
    });

    // Select the bookmark
    fireEvent.click(screen.getByText("Expo Router ドキュメント"));

    await waitFor(() => {
      expect(screen.getAllByText("Expo Router ドキュメント")).toHaveLength(2);
    });

    // Deselect by clicking the × on the chip
    fireEvent.click(screen.getByText("×"));

    await waitFor(() => {
      expect(screen.getAllByText("Expo Router ドキュメント")).toHaveLength(1);
    });
  });
});
