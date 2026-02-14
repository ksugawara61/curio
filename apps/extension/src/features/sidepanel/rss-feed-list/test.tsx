import { renderSuspense, screen, waitFor } from "@curio/testing-library";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../../libs/test/msw/server";
import { RssFeedList } from ".";
import { CreateRssFeedMutationMocks } from "./CreateRssFeedMutation.mocks";
import { DeleteRssFeedMutationMocks } from "./DeleteRssFeedMutation.mocks";
import { RssArticlesQueryMocks } from "./RssArticlesQuery.mocks";
import { RssFeedsQueryMocks } from "./RssFeedsQuery.mocks";

describe("RssFeedList", () => {
  it("displays loading state initially", async () => {
    server.use(RssFeedsQueryMocks.Loading);

    await renderSuspense(<RssFeedList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays empty state when no feeds exist", async () => {
    server.use(RssFeedsQueryMocks.Empty);

    await renderSuspense(<RssFeedList />);

    await waitFor(() => {
      expect(screen.getByText("No RSS feeds yet")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Add an RSS feed URL above to get started"),
    ).toBeInTheDocument();
  });

  it("displays feed list", async () => {
    server.use(RssFeedsQueryMocks.Success);

    await renderSuspense(<RssFeedList />);

    await waitFor(() => {
      expect(screen.getByText("Example Blog")).toBeInTheDocument();
    });

    expect(screen.getByText("Tech Blog")).toBeInTheDocument();
    expect(
      screen.getByText("A blog about web development"),
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays the add feed form", async () => {
    server.use(RssFeedsQueryMocks.Empty);

    await renderSuspense(<RssFeedList />);

    await waitFor(() => {
      expect(screen.getByText("Add RSS Feed")).toBeInTheDocument();
    });

    expect(
      screen.getByPlaceholderText("https://example.com/rss.xml"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("submits the add feed form", async () => {
    const user = userEvent.setup();
    server.use(RssFeedsQueryMocks.Empty, CreateRssFeedMutationMocks.Success);

    await renderSuspense(<RssFeedList />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("https://example.com/rss.xml"),
      ).toBeInTheDocument();
    });

    const urlInput = screen.getByPlaceholderText("https://example.com/rss.xml");
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(urlInput, "https://example.com/feed.xml");
    await user.click(addButton);

    await waitFor(() => {
      expect(urlInput).toHaveValue("");
    });
  });

  it("navigates to feed detail when clicking a feed title", async () => {
    server.use(RssFeedsQueryMocks.Success, RssArticlesQueryMocks.Success);

    await renderSuspense(<RssFeedList />);

    await waitFor(() => {
      expect(screen.getByText("Example Blog")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await act(async () => {
      await user.click(screen.getByText("Example Blog"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Getting Started with React"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
    expect(screen.getByText("3 articles")).toBeInTheDocument();
  });

  it("navigates back from feed detail", async () => {
    server.use(RssFeedsQueryMocks.Success, RssArticlesQueryMocks.Success);

    await renderSuspense(<RssFeedList />);

    await waitFor(() => {
      expect(screen.getByText("Example Blog")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await act(async () => {
      await user.click(screen.getByText("Example Blog"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Getting Started with React"),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Back/));

    await waitFor(() => {
      expect(screen.getByText("RSS Feeds")).toBeInTheDocument();
    });
  });

  it("handles delete with confirmation", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    server.use(RssFeedsQueryMocks.Success, DeleteRssFeedMutationMocks.Success);

    await renderSuspense(<RssFeedList />);

    await waitFor(() => {
      expect(screen.getByText("Example Blog")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Delete "Example Blog"?');
  });

  it("displays error message when query fails", async () => {
    server.use(RssFeedsQueryMocks.Error);

    await renderSuspense(<RssFeedList />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
