import { renderSuspense, screen, waitFor } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { BlockedDomainsMocks } from "../../core/shared/hooks/useBlockedDomains.mocks";
import { server } from "../../libs/test/msw/server";
import { BookmarkQueryMocks } from "../shared/graphql/BookmarkQuery.mocks";
import { Popup } from ".";

describe("Popup", () => {
  it("renders the title", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSuspense(
      <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
      { swrHandlers: [BlockedDomainsMocks.Empty] },
    );

    expect(screen.getByText("Curio")).toBeInTheDocument();
  });

  it("displays loading state when URL is not yet available", async () => {
    await renderSuspense(<Popup />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    expect(screen.getByText("Curio")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays bookmark button when URL is not bookmarked", async () => {
    server.use(BookmarkQueryMocks.NotFound);

    await renderSuspense(
      <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
      { swrHandlers: [BlockedDomainsMocks.Empty] },
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
      { swrHandlers: [BlockedDomainsMocks.Empty] },
    );

    await waitFor(() => {
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });
  });

  it("displays error message when query fails", async () => {
    server.use(BookmarkQueryMocks.Error);

    await renderSuspense(
      <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
      { swrHandlers: [BlockedDomainsMocks.Empty] },
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  describe("domain blocklist", () => {
    it("displays blocked message when domain is in blocklist", async () => {
      server.use(BookmarkQueryMocks.NotFound);

      await renderSuspense(
        <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
        { swrHandlers: [BlockedDomainsMocks.WithDomains] },
      );

      await waitFor(() => {
        expect(
          screen.getByText("Bookmarking is disabled for this domain."),
        ).toBeInTheDocument();
      });
    });

    it("does not show bookmark button when domain is blocked", async () => {
      server.use(BookmarkQueryMocks.NotFound);

      await renderSuspense(
        <Popup initialUrl="https://example.com" initialTitle="Example Page" />,
        { swrHandlers: [BlockedDomainsMocks.WithDomains] },
      );

      await waitFor(() => {
        expect(
          screen.getByText("Bookmarking is disabled for this domain."),
        ).toBeInTheDocument();
      });

      expect(
        screen.queryByRole("button", { name: "Bookmark this page" }),
      ).not.toBeInTheDocument();
    });

    it("allows bookmarking when domain is not in blocklist", async () => {
      server.use(BookmarkQueryMocks.NotFound);

      await renderSuspense(
        <Popup
          initialUrl="https://allowed-domain.com"
          initialTitle="Allowed Page"
        />,
        { swrHandlers: [BlockedDomainsMocks.WithDomains] },
      );

      await waitFor(() => {
        expect(screen.getByText("Allowed Page")).toBeInTheDocument();
      });

      expect(
        screen.getByRole("button", { name: "Bookmark this page" }),
      ).toBeInTheDocument();
    });
  });
});
