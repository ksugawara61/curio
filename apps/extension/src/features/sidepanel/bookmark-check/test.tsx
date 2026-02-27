import { renderSuspense, screen, waitFor } from "@curio/testing-library";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "../../../libs/test/msw/server";
import { BlockedDomainsMocks } from "../../../shared/hooks/useBlockedDomains.mocks";
import { BookmarkQueryMocks } from "../../shared/graphql/BookmarkQuery.mocks";
import { CreateBookmarkMutationMocks } from "../../shared/graphql/CreateBookmarkMutation.mocks";
import { BookmarksListQueryMocks } from "../bookmark-list/BookmarksQuery.mocks";
import { BookmarkCheck } from ".";
import { UpdateBookmarkMutationMocks } from "./UpdateBookmarkMutation.mocks";

const defaultProps = {
  currentUrl: "https://example.com",
  currentTitle: "Example Page",
};

describe("BookmarkCheck", () => {
  beforeEach(() => {
    server.use(BookmarksListQueryMocks.Empty);
  });
  it("displays loading state initially", async () => {
    server.use(BookmarkQueryMocks.Loading);

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays add bookmark form when URL is not bookmarked", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

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

  it("displays edit form when URL is already bookmarked", async () => {
    server.use(BookmarkQueryMocks.WithMatchingUrl(defaultProps.currentUrl));

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });

    expect(screen.getByText("Matching Bookmark")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update Bookmark" }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Add a description..."),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g., tech, tutorial, react"),
    ).toBeInTheDocument();
  });

  it("pre-fills form with existing bookmark data", async () => {
    server.use(BookmarkQueryMocks.WithMatchingUrl(defaultProps.currentUrl));

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });

    const descriptionInput = screen.getByPlaceholderText(
      "Add a description...",
    );
    const tagsInput = screen.getByPlaceholderText(
      "e.g., tech, tutorial, react",
    );

    await waitFor(() => {
      expect(descriptionInput).toHaveValue(
        "This bookmark matches the current URL",
      );
    });
    expect(tagsInput).toHaveValue("Matched");
  });

  it("displays error message when query fails", async () => {
    server.use(BookmarkQueryMocks.Error);

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch bookmark/)).toBeInTheDocument();
  });

  it("allows adding a bookmark with description and tags", async () => {
    server.use(
      BookmarkQueryMocks.NotFound,
      CreateBookmarkMutationMocks.Success,
    );

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

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

  it("allows updating an existing bookmark", async () => {
    const user = userEvent.setup();
    server.use(
      BookmarkQueryMocks.WithMatchingUrl(defaultProps.currentUrl),
      UpdateBookmarkMutationMocks.Success,
    );

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });

    const descriptionInput = screen.getByPlaceholderText(
      "Add a description...",
    );
    const tagsInput = screen.getByPlaceholderText(
      "e.g., tech, tutorial, react",
    );
    const updateButton = screen.getByRole("button", {
      name: "Update Bookmark",
    });

    // Wait for form to be pre-filled
    await waitFor(() => {
      expect(descriptionInput).toHaveValue(
        "This bookmark matches the current URL",
      );
    });

    // Clear and type new values
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");
    await user.clear(tagsInput);
    await user.type(tagsInput, "new, tags");

    expect(descriptionInput).toHaveValue("Updated description");
    expect(tagsInput).toHaveValue("new, tags");
    expect(updateButton).toBeEnabled();
  });

  it("displays update button for existing bookmarks", async () => {
    server.use(BookmarkQueryMocks.Success);

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Update Bookmark" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add Bookmark" }),
    ).not.toBeInTheDocument();
  });

  it("displays add button for new bookmarks", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSuspense(<BookmarkCheck {...defaultProps} />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add Bookmark" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Add Bookmark" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Update Bookmark" }),
    ).not.toBeInTheDocument();
  });
});
