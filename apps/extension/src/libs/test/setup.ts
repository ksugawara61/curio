import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";
import { useSWRConfig } from "swr";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./msw/server";

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
