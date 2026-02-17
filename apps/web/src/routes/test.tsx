import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Index Route", () => {
  it("renders Hello World", async () => {
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => (
        <div>
          <h1 className="text-4xl font-bold text-primary">Hello World</h1>
          <p>Welcome to Curio Web</p>
        </div>
      ),
    });
    rootRoute.addChildren([indexRoute]);

    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "Hello World" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Welcome to Curio Web")).toBeInTheDocument();
  });
});
