import { describe, expect, it } from "vitest";
import { ArticleMocks } from "./application/article/queries/get-articles/mocks";
import { mockServer } from "./libs/test/mockServer";
import { server } from "./server";

describe("GraphQL Resolvers", () => {
  describe("Query", () => {
    describe("articles", () => {
      it("should return an array of articles from Qiita", async () => {
        mockServer.use(...ArticleMocks.Success);
        const result = await server.Query.articles({
          source: "qiita",
          offset: 0,
          limit: 20,
        });

        expect(result.length).toBeGreaterThan(0);
        for (const article of result) {
          expect(article).toHaveProperty("id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("url");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("tags");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("updated_at");
          expect(article.source).toBe("qiita");
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
