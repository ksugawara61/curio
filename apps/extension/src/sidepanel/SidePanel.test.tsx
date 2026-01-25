import { render, screen, waitFor } from "@curio/graphql-client";
import { describe, expect, it } from "vitest";
import { server } from "../test/msw/server";
import { ArticlesQueryMocks } from "./mocks";
import { SidePanel } from "./SidePanel";

describe("SidePanel", () => {
  it("displays loading state initially", () => {
    server.use(ArticlesQueryMocks.Loading);

    render(<SidePanel />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays articles when data is loaded", async () => {
    server.use(ArticlesQueryMocks.Success);

    render(<SidePanel />);

    expect(await screen.findByText("Test Article 1")).toBeInTheDocument();

    expect(screen.getByText("Test Article 2")).toBeInTheDocument();
    expect(screen.getByText("by Test User")).toBeInTheDocument();
    expect(screen.getByText("by Another User")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("displays error message when query fails", async () => {
    server.use(ArticlesQueryMocks.Error);

    render(<SidePanel />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch articles/)).toBeInTheDocument();
  });

  it("displays article links with correct href", async () => {
    server.use(ArticlesQueryMocks.SingleArticle);
    render(<SidePanel />);

    const link = await screen.findByRole("link", { name: "Test Article" });

    expect(link).toHaveAttribute("href", "https://example.com/test");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");

    // Date formatting depends on locale, so just check that a date is displayed
    const dateText = new Date("2024-01-01T00:00:00Z").toLocaleDateString();
    expect(screen.getByText(dateText)).toBeInTheDocument();
  });
});
