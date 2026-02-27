import { renderSuspense, screen, waitFor } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { server } from "../../libs/test/msw/server";
import { BlockedDomainsMocks } from "../../shared/hooks/useBlockedDomains.mocks";
import { BookmarkQueryMocks } from "../shared/graphql/BookmarkQuery.mocks";
import { SidePanel } from ".";
import { ArchivedBookmarksQueryMocks } from "./bookmark-list/ArchivedBookmarksQuery.mocks";
import { BookmarksListQueryMocks } from "./bookmark-list/BookmarksQuery.mocks";

const defaultProps = {
  initialUrl: "https://example.com",
  initialTitle: "Example Page",
};

const renderSidePanel = async (props = defaultProps) => {
  return renderSuspense(<SidePanel {...props} />, {
    swrHandlers: [BlockedDomainsMocks.Empty],
  });
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
  });

  it("shows Current Page tab by default", async () => {
    server.use(BookmarkQueryMocks.NotFound, BookmarksListQueryMocks.Empty);

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
    server.use(
      BookmarkQueryMocks.NotFound,
      BookmarksListQueryMocks.Empty,
      ArchivedBookmarksQueryMocks.Empty,
    );

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
    server.use(
      BookmarkQueryMocks.WithMatchingUrl(defaultProps.initialUrl),
      BookmarksListQueryMocks.Empty,
    );

    await renderSidePanel();

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });
  });
});
