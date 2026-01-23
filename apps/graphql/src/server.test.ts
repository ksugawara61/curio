import type { GraphQLFormattedError } from "graphql";
import { describe, expect, it } from "vitest";
import { server } from "./server";

type HelloQueryResponse = {
  hello: string | null;
};

type SingleResultBody<TData> = {
  kind: "single";
  singleResult: {
    data?: TData | null;
    errors?: readonly GraphQLFormattedError[];
  };
};

const isSingleResult = <TData>(
  body: Awaited<ReturnType<typeof server.executeOperation<TData>>>["body"]
): body is SingleResultBody<TData> => {
  return body.kind === "single";
};

describe("GraphQL Resolver Tests", () => {
  it("should return 'world' for hello query", async () => {
    const { body } = await server.executeOperation<HelloQueryResponse>({
      query: `query {
        hello
      }`,
    });

    if (!isSingleResult<HelloQueryResponse>(body)) {
      throw new Error("Expected single result");
    }
    expect(body.singleResult.errors).toBeUndefined();
    expect(body.singleResult.data?.hello).toBe("world");
  });
});
