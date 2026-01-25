import { render, screen, waitFor } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { server } from "../../../../libs/test/msw/server";
import { BookmarkCheck } from ".";
import { BookmarksQueryMocks } from "./BookmarksQuery.mocks";
import { CreateBookmarkMutationMocks } from "./CreateBookmarkMutation.mocks";

const defaultProps = {
  currentUrl: "https://example.com",
  currentTitle: "Example Page",
};

describe("BookmarkCheck", () => {
  it("displays loading state initially", () => {
    server.use(BookmarksQueryMocks.Loading);

    render(<BookmarkCheck {...defaultProps} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays add bookmark form when URL is not bookmarked", async () => {
    server.use(BookmarksQueryMocks.Empty);

    render(<BookmarkCheck {...defaultProps} />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add Bookmark" }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(defaultProps.currentUrl)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(defaultProps.currentTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Bookmark" }),
    ).toBeInTheDocument();
  });

  it("displays bookmark details when URL is already bookmarked", async () => {
    server.use(BookmarksQueryMocks.WithMatchingUrl(defaultProps.currentUrl));

    render(<BookmarkCheck {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });

    expect(screen.getByText("Matching Bookmark")).toBeInTheDocument();
    expect(
      screen.getByText("This bookmark matches the current URL"),
    ).toBeInTheDocument();
    expect(screen.getByText("Matched")).toBeInTheDocument();
  });

  it("displays error message when query fails", async () => {
    server.use(BookmarksQueryMocks.Error);

    render(<BookmarkCheck {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch bookmarks/)).toBeInTheDocument();
  });

  it("allows adding a bookmark with description and tags", async () => {
    server.use(BookmarksQueryMocks.Empty, CreateBookmarkMutationMocks.Success);

    render(<BookmarkCheck {...defaultProps} />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add Bookmark" }),
      ).toBeInTheDocument();
    });

    const descriptionInput = screen.getByPlaceholderText(
      "Add a description...",
    );
    const tagsInput = screen.getByPlaceholderText(
      "e.g., tech, tutorial, react",
    );
    const addButton = screen.getByRole("button", { name: "Add Bookmark" });

    expect(descriptionInput).toBeInTheDocument();
    expect(tagsInput).toBeInTheDocument();
    expect(addButton).toBeEnabled();
  });
});
