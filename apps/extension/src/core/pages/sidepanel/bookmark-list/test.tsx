import { renderSuspense, screen, waitFor } from "@curio/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../../libs/test/msw/server";
import { DeleteBookmarkMutationMocks } from "../../shared/graphql/mutations/DeleteBookmarkMutation.mocks";
import { BookmarksListQueryMocks } from "../../shared/graphql/queries/BookmarksQuery.mocks";
import { BookmarkList } from ".";

describe("BookmarkList", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays loading state initially", async () => {
    server.use(BookmarksListQueryMocks.Loading);

    await renderSuspense(<BookmarkList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays bookmarks when data is loaded", async () => {
    server.use(BookmarksListQueryMocks.Success);

    await renderSuspense(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("React Documentation")).toBeInTheDocument();
    });

    expect(screen.getByText("TypeScript Handbook")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("displays empty state when no bookmarks exist", async () => {
    server.use(BookmarksListQueryMocks.Empty);

    await renderSuspense(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("No bookmarks yet")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Add bookmarks from the Current Page tab"),
    ).toBeInTheDocument();
  });

  it("displays error message when query fails", async () => {
    server.use(BookmarksListQueryMocks.Error);

    await renderSuspense(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch bookmarks/)).toBeInTheDocument();
  });

  it("displays bookmark count badge", async () => {
    server.use(BookmarksListQueryMocks.Success);

    await renderSuspense(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("displays bookmark links with correct attributes", async () => {
    server.use(BookmarksListQueryMocks.SingleBookmark);

    await renderSuspense(<BookmarkList />);

    const link = await screen.findByRole("link", {
      name: "React Documentation",
    });

    expect(link).toHaveAttribute("href", "https://react.dev");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays delete button for each bookmark", async () => {
    server.use(BookmarksListQueryMocks.Success);

    await renderSuspense(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("React Documentation")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    expect(deleteButtons).toHaveLength(3);
  });

  it("calls deleteBookmark mutation when delete is confirmed", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    server.use(
      BookmarksListQueryMocks.SingleBookmark,
      DeleteBookmarkMutationMocks.Success,
    );

    await renderSuspense(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("React Documentation")).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Delete "React Documentation"?');
  });

  it("does not call deleteBookmark mutation when delete is cancelled", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    server.use(BookmarksListQueryMocks.SingleBookmark);

    await renderSuspense(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("React Documentation")).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Delete "React Documentation"?');
    expect(screen.getByText("React Documentation")).toBeInTheDocument();
  });

  it("refetches bookmarks after successful deletion", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    server.use(
      DeleteBookmarkMutationMocks.Success,
      BookmarksListQueryMocks.Success,
    );

    await renderSuspense(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("React Documentation")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("React Documentation")).toBeInTheDocument();
    });
  });
});
