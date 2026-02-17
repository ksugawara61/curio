import { renderSuspense, screen, within } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { BlockedDomainsMocks } from "../../../shared/hooks/useBlockedDomains.mocks";
import { Settings } from ".";

describe("Settings", () => {
  it("displays blocked domains from swrHandlers", async () => {
    await renderSuspense(<Settings />, {
      swrHandlers: [BlockedDomainsMocks.WithDomains],
    });

    const list = screen.getByRole("list");
    expect(within(list).getByText("example.com")).toBeInTheDocument();
    expect(within(list).getByText("test.com")).toBeInTheDocument();
    expect(
      within(list).getByText("other-domain.com/private"),
    ).toBeInTheDocument();
  });

  it("displays empty state when no domains are blocked", async () => {
    await renderSuspense(<Settings />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    expect(
      screen.getByText("No blocked domains or paths registered."),
    ).toBeInTheDocument();
  });
});
