import { describe, expect, it } from "vitest";
import { ArticleMocks } from "./application/articles/FetchArticlesUseCase.mocks";
import { mockServer } from "./libs/test/mockServer";
import { server } from "./server";

describe("GraphQL Resolvers", () => {
  describe("Query", () => {
    describe("articles", () => {
      it("should return an array of articles", async () => {
        mockServer.use(...ArticleMocks.Success);
        const offset = 0;
        const limit = 20;
        const result = await server.Query.articles(offset, limit);

        expect(result.length).toBeGreaterThan(0);
        for (const article of result) {
          expect(article).toHaveProperty("id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("url");
          expect(article).toHaveProperty("user");
          expect(article).toHaveProperty("tags");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("updated_at");
        }
      });
    });
  });

  describe("Mutation", () => {
    it("should have bookmark mutations", () => {
      expect(server.Mutation).toHaveProperty("createBookmark");
      expect(server.Mutation).toHaveProperty("updateBookmark");
      expect(server.Mutation).toHaveProperty("deleteBookmark");
      expect(typeof server.Mutation.createBookmark).toBe("function");
      expect(typeof server.Mutation.updateBookmark).toBe("function");
      expect(typeof server.Mutation.deleteBookmark).toBe("function");
    });
  });
});
