import { renderSuspense, screen } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { BlockedDomainsMocks } from "../../../core/shared/hooks/useBlockedDomains.mocks";
import { Settings } from ".";

describe("Settings", () => {
  it("displays blocked domains from swrHandlers", async () => {
    await renderSuspense(<Settings />, {
      swrHandlers: [BlockedDomainsMocks.WithDomains],
    });

    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("test.com")).toBeInTheDocument();
  });

  it("displays empty state when no domains are blocked", async () => {
    await renderSuspense(<Settings />, {
      swrHandlers: [BlockedDomainsMocks.Empty],
    });

    expect(
      screen.getByText("No blocked domains registered."),
    ).toBeInTheDocument();
  });
});
