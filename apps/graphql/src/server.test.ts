import type { GraphQLFormattedError } from "graphql";
import { describe, expect, it } from "vitest";
import type { Query } from "./schema/generated/graphql";
import { server } from "./server";

type SingleResultBody<TData> = {
  kind: "single";
  singleResult: {
    data?: TData | null;
    errors?: readonly GraphQLFormattedError[];
  };
};

const isSingleResult = <TData>(
  body: Awaited<ReturnType<typeof server.executeOperation<TData>>>["body"],
): body is SingleResultBody<TData> => {
  return body.kind === "single";
};

describe("GraphQL Resolver Tests", () => {
  it("should return 'world' for hello query", async () => {
    const { body } = await server.executeOperation<Query>({
      query: `query {
        hello
      }`,
    });

    if (!isSingleResult<Query>(body)) {
      throw new Error("Expected single result");
    }
    expect(body.singleResult.errors).toBeUndefined();
    expect(body.singleResult.data?.hello).toBe("world");
  });
});
