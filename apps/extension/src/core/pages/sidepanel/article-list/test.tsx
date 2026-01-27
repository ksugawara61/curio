import { render, screen, waitFor } from "@curio/testing-library";
import { act, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { describe, expect, it } from "vitest";
import { server } from "../../../../libs/test/msw/server";
import { ErrorFallback } from "../../../components/ErrorFallback";
import { Loading } from "../../../components/Loading";
import { ArticleList } from ".";
import { ArticlesListQueryMocks } from "./ArticlesQuery.mocks";

const renderWithSuspense = async () => {
  let result: ReturnType<typeof render> | undefined;
  await act(async () => {
    result = render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <ArticleList />
        </Suspense>
      </ErrorBoundary>,
    );
  });
  if (!result) throw new Error("render failed");
  return result;
};

describe("ArticleList", () => {
  it("displays loading state initially", async () => {
    server.use(ArticlesListQueryMocks.Loading);

    await renderWithSuspense();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays articles when data is loaded", async () => {
    server.use(ArticlesListQueryMocks.Success);

    await renderWithSuspense();

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

    await renderWithSuspense();

    await waitFor(() => {
      expect(screen.getByText("No articles yet")).toBeInTheDocument();
    });
  });

  it("displays error message when query fails", async () => {
    server.use(ArticlesListQueryMocks.Error);

    await renderWithSuspense();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch articles/)).toBeInTheDocument();
  });

  it("displays article count badge", async () => {
    server.use(ArticlesListQueryMocks.Success);

    await renderWithSuspense();

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("displays article links with correct attributes", async () => {
    server.use(ArticlesListQueryMocks.SingleArticle);

    await renderWithSuspense();

    const link = await screen.findByRole("link", {
      name: "Getting Started with React",
    });

    expect(link).toHaveAttribute("href", "https://example.com/react-guide");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays article tags", async () => {
    server.use(ArticlesListQueryMocks.SingleArticle);

    await renderWithSuspense();

    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });
});
