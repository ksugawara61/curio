import { render, screen, waitFor } from "@curio/testing-library";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { server } from "../../../libs/test/msw/server";
import { BookmarkQueryMocks } from "../shared/graphql/BookmarkQuery.mocks";
import { SidePanel } from ".";
import { ArticlesListQueryMocks } from "./article-list/ArticlesQuery.mocks";
import { BookmarksListQueryMocks } from "./bookmark-list/BookmarksQuery.mocks";

const defaultProps = {
  initialUrl: "https://example.com",
  initialTitle: "Example Page",
};

const renderSidePanel = async (props = defaultProps) => {
  let result: ReturnType<typeof render> | undefined;
  await act(async () => {
    result = render(<SidePanel {...props} />);
  });
  if (!result) throw new Error("render failed");
  return result;
};

describe("SidePanel", () => {
  it("displays tab navigation", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSidePanel();

    await waitFor(() => {
      expect(
        screen.getByRole("tab", { name: "Current Page" }),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("tab", { name: "Bookmarks" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Articles" })).toBeInTheDocument();
  });

  it("shows Current Page tab by default", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSidePanel();

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
    server.use(BookmarkQueryMocks.NotFound, BookmarksListQueryMocks.Empty);

    const { user } = await renderSidePanel();
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
    server.use(BookmarkQueryMocks.NotFound, ArticlesListQueryMocks.Success);

    const { user } = await renderSidePanel();

    // Wait for initial load
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add Bookmark" }),
      ).toBeInTheDocument();
    });

    const articlesTab = screen.getByRole("tab", { name: "Articles" });
    await user.click(articlesTab);

    expect(articlesTab).toHaveAttribute("aria-selected", "true");

    await waitFor(() => {
      expect(
        screen.getByText("Getting Started with React"),
      ).toBeInTheDocument();
    });
  });

  it("displays header with Curio title", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSidePanel();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Curio" }),
      ).toBeInTheDocument();
    });
  });

  it("shows bookmark details when URL is already bookmarked", async () => {
    server.use(BookmarkQueryMocks.WithMatchingUrl(defaultProps.initialUrl));

    await renderSidePanel();

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });
  });
});
