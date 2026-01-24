import {
  createMockQuery,
  GetArticles,
  render,
  screen,
  waitFor,
} from "@curio/graphql-client";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../test/msw/server";
import { SidePanel } from "./SidePanel";

describe("SidePanel", () => {
  it("displays loading state initially", () => {
    server.use(
      createMockQuery(GetArticles, async () => {
        // Delay response to keep loading state
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({
          data: { articles: [] },
        });
      }),
    );

    render(<SidePanel />);

    // Check for loading spinner by class name
    const loadingSpinner = document.querySelector(
      ".loading.loading-spinner.loading-lg",
    );
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("displays articles when data is loaded", async () => {
    const mockArticles = [
      {
        id: "1",
        title: "Test Article 1",
        body: "This is a test article body",
        url: "https://example.com/article1",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        user: {
          name: "Test User",
        },
        tags: [{ name: "React" }, { name: "TypeScript" }],
      },
      {
        id: "2",
        title: "Test Article 2",
        body: "This is another test article",
        url: "https://example.com/article2",
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
        user: {
          name: "Another User",
        },
        tags: [{ name: "JavaScript" }],
      },
    ];

    server.use(
      createMockQuery(GetArticles, () => {
        return HttpResponse.json({
          data: { articles: mockArticles },
        });
      }),
    );

    render(<SidePanel />);

    await waitFor(() => {
      expect(screen.getByText("Test Article 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Article 2")).toBeInTheDocument();
    expect(screen.getByText("by Test User")).toBeInTheDocument();
    expect(screen.getByText("by Another User")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("displays error message when query fails", async () => {
    server.use(
      createMockQuery(GetArticles, () => {
        return HttpResponse.json({
          errors: [
            {
              message: "Failed to fetch articles",
            },
          ],
        });
      }),
    );

    render(<SidePanel />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch articles/)).toBeInTheDocument();
  });

  it("displays article links with correct href", async () => {
    const mockArticles = [
      {
        id: "1",
        title: "Test Article",
        body: "Test body",
        url: "https://example.com/test",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        user: {
          name: "Test User",
        },
        tags: [],
      },
    ];

    server.use(
      createMockQuery(GetArticles, () => {
        return HttpResponse.json({
          data: { articles: mockArticles },
        });
      }),
    );

    render(<SidePanel />);

    await waitFor(() => {
      const link = screen.getByRole("link", { name: "Test Article" });
      expect(link).toHaveAttribute("href", "https://example.com/test");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("displays formatted creation date", async () => {
    const mockArticles = [
      {
        id: "1",
        title: "Test Article",
        body: "Test body",
        url: "https://example.com/test",
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-01-15T00:00:00Z",
        user: {
          name: "Test User",
        },
        tags: [],
      },
    ];

    server.use(
      createMockQuery(GetArticles, () => {
        return HttpResponse.json({
          data: { articles: mockArticles },
        });
      }),
    );

    render(<SidePanel />);

    await waitFor(() => {
      // Date formatting depends on locale, so just check that a date is displayed
      const dateText = new Date("2024-01-15T00:00:00Z").toLocaleDateString();
      expect(screen.getByText(dateText)).toBeInTheDocument();
    });
  });
});
