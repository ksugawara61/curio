import { render, screen, server, waitFor } from "@curio/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SidePanel } from ".";
import { ArticlesListQueryMocks } from "./article-list/ArticlesQuery.mocks";
import { BookmarksQueryMocks } from "./bookmark-check/BookmarksQuery.mocks";
import { BookmarksListQueryMocks } from "./bookmark-list/BookmarksQuery.mocks";

const defaultProps = {
  initialUrl: "https://example.com",
  initialTitle: "Example Page",
};

describe("SidePanel", () => {
  it("displays tab navigation", () => {
    server.use(BookmarksQueryMocks.Empty);

    render(<SidePanel {...defaultProps} />);

    expect(
      screen.getByRole("tab", { name: "Current Page" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Bookmarks" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Articles" })).toBeInTheDocument();
  });

  it("shows Current Page tab by default", async () => {
    server.use(BookmarksQueryMocks.Empty);

    render(<SidePanel {...defaultProps} />);

    expect(screen.getByRole("tab", { name: "Current Page" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add Bookmark" }),
      ).toBeInTheDocument();
    });
  });

  it("switches to Bookmarks tab when clicked", async () => {
    const user = userEvent.setup();
    server.use(BookmarksQueryMocks.Empty, BookmarksListQueryMocks.Empty);

    render(<SidePanel {...defaultProps} />);

    // Wait for initial load
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add Bookmark" }),
      ).toBeInTheDocument();
    });

    const bookmarksTab = screen.getByRole("tab", { name: "Bookmarks" });
    await user.click(bookmarksTab);

    expect(bookmarksTab).toHaveAttribute("aria-selected", "true");

    await waitFor(() => {
      expect(screen.getByText("No bookmarks yet")).toBeInTheDocument();
    });
  });

  it("switches to Articles tab when clicked", async () => {
    const user = userEvent.setup();
    server.use(BookmarksQueryMocks.Empty, ArticlesListQueryMocks.Success);

    render(<SidePanel {...defaultProps} />);

    const articlesTab = screen.getByRole("tab", { name: "Articles" });
    await user.click(articlesTab);

    expect(articlesTab).toHaveAttribute("aria-selected", "true");

    await waitFor(() => {
      expect(
        screen.getByText("Getting Started with React"),
      ).toBeInTheDocument();
    });
  });

  it("displays header with Curio title", () => {
    server.use(BookmarksQueryMocks.Empty);

    render(<SidePanel {...defaultProps} />);

    expect(screen.getByRole("heading", { name: "Curio" })).toBeInTheDocument();
  });

  it("shows bookmark details when URL is already bookmarked", async () => {
    server.use(BookmarksQueryMocks.WithMatchingUrl(defaultProps.initialUrl));

    render(<SidePanel {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });
  });
});
