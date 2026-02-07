import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";
import { useSWRConfig } from "swr";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./msw/server";

// Mock @clerk/chrome-extension to avoid webextension-polyfill errors in jsdom
vi.mock("@clerk/chrome-extension", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignIn: () => null,
  SignUp: () => null,
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: () => null,
  useAuth: () => ({
    getToken: () => Promise.resolve("test-token"),
    signOut: () => Promise.resolve(),
    isSignedIn: true,
    isLoaded: true,
  }),
  useUser: () => ({
    user: { id: "test-user" },
    isSignedIn: true,
    isLoaded: true,
  }),
  useSession: () => ({
    session: { id: "test-session" },
    isSignedIn: true,
    isLoaded: true,
  }),
}));

// Suppress known React 19 warnings for Suspense-compatible libraries (Apollo Client, SWR)
// These warnings are false positives when using useSuspenseQuery / useSWR with suspense: true
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const message = typeof args[0] === "string" ? args[0] : "";
  if (
    message.includes("suspended by an uncached promise") ||
    message.includes("not wrapped in act(")
  ) {
    return;
  }
  originalConsoleError(...args);
};

// MSW server setup
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  // Clear SWR cache between tests
  const { result } = renderHook(() => useSWRConfig());
  const cache = result.current.cache as Map<string, unknown>;
  cache.clear();
});
afterAll(() => server.close());
