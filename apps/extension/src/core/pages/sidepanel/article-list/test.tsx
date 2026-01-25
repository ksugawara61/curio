import { render, screen, server, waitFor } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { ArticleList } from ".";
import { ArticlesListQueryMocks } from "./ArticlesQuery.mocks";

describe("ArticleList", () => {
  it("displays loading state initially", () => {
    server.use(ArticlesListQueryMocks.Loading);

    render(<ArticleList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays articles when data is loaded", async () => {
    server.use(ArticlesListQueryMocks.Success);

    render(<ArticleList />);

    await waitFor(() => {
      expect(
        screen.getByText("Getting Started with React"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
    expect(screen.getByText("Building Chrome Extensions")).toBeInTheDocument();
    expect(screen.getByText("by John Doe")).toBeInTheDocument();
    expect(screen.getByText("by Jane Smith")).toBeInTheDocument();
  });

  it("displays empty state when no articles exist", async () => {
    server.use(ArticlesListQueryMocks.Empty);

    render(<ArticleList />);

    await waitFor(() => {
      expect(screen.getByText("No articles yet")).toBeInTheDocument();
    });
  });

  it("displays error message when query fails", async () => {
    server.use(ArticlesListQueryMocks.Error);

    render(<ArticleList />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch articles/)).toBeInTheDocument();
  });

  it("displays article count badge", async () => {
    server.use(ArticlesListQueryMocks.Success);

    render(<ArticleList />);

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("displays article links with correct attributes", async () => {
    server.use(ArticlesListQueryMocks.SingleArticle);

    render(<ArticleList />);

    const link = await screen.findByRole("link", {
      name: "Getting Started with React",
    });

    expect(link).toHaveAttribute("href", "https://example.com/react-guide");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays article tags", async () => {
    server.use(ArticlesListQueryMocks.SingleArticle);

    render(<ArticleList />);

    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });
});
