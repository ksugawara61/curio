import { screen, waitFor } from "@curio/testing-library";
import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StorybookProvider } from "../../../../libs/test/StorybookProvider";
import { BlockedDomainsMocks } from "../../../shared/hooks/useBlockedDomains.mocks";
import { Settings } from ".";

describe("Settings", () => {
  it("displays blocked domains from swrHandlers", async () => {
    await act(async () => {
      render(
        <StorybookProvider swrHandlers={[BlockedDomainsMocks.WithDomains]}>
          <Settings />
        </StorybookProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText("example.com")).toBeInTheDocument();
    });
    expect(screen.getByText("test.com")).toBeInTheDocument();
  });

  it("displays empty state when no domains are blocked", async () => {
    await act(async () => {
      render(
        <StorybookProvider swrHandlers={[BlockedDomainsMocks.Empty]}>
          <Settings />
        </StorybookProvider>,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("No blocked domains registered."),
      ).toBeInTheDocument();
    });
  });
});
