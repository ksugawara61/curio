import { renderSuspense, screen, waitFor } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { server } from "../../../libs/test/msw/server";
import { BookmarkQueryMocks } from "../shared/graphql/queries/BookmarkQuery.mocks";
import { Popup } from ".";

describe("Popup", () => {
  it("renders the title", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSuspense(
      <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
    );

    expect(screen.getByText("Curio")).toBeInTheDocument();
  });

  it("displays loading state when URL is not yet available", async () => {
    await renderSuspense(<Popup />);

    expect(screen.getByText("Curio")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays bookmark button when URL is not bookmarked", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSuspense(
      <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
    );

    await waitFor(() => {
      expect(screen.getByText("Example Page")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Bookmark this page" }),
    ).toBeInTheDocument();
  });

  it("displays bookmarked status when URL is already bookmarked", async () => {
    server.use(BookmarkQueryMocks.WithMatchingUrl("https://example.com"));

    await renderSuspense(
      <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
    );

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });
  });

  it("displays error message when query fails", async () => {
    server.use(BookmarkQueryMocks.Error);

    await renderSuspense(
      <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
