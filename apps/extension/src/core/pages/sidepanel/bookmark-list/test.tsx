import { render, screen, server, waitFor } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { BookmarkList } from ".";
import { BookmarksListQueryMocks } from "./BookmarksQuery.mocks";

describe("BookmarkList", () => {
  it("displays loading state initially", () => {
    server.use(BookmarksListQueryMocks.Loading);

    render(<BookmarkList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays bookmarks when data is loaded", async () => {
    server.use(BookmarksListQueryMocks.Success);

    render(<BookmarkList />);

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

    render(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("No bookmarks yet")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Add bookmarks from the Current Page tab"),
    ).toBeInTheDocument();
  });

  it("displays error message when query fails", async () => {
    server.use(BookmarksListQueryMocks.Error);

    render(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch bookmarks/)).toBeInTheDocument();
  });

  it("displays bookmark count badge", async () => {
    server.use(BookmarksListQueryMocks.Success);

    render(<BookmarkList />);

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("displays bookmark links with correct attributes", async () => {
    server.use(BookmarksListQueryMocks.SingleBookmark);

    render(<BookmarkList />);

    const link = await screen.findByRole("link", {
      name: "React Documentation",
    });

    expect(link).toHaveAttribute("href", "https://react.dev");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
