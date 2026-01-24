import { describe, expect, it } from "vitest";
import { mockServer } from "../../libs/test/mockServer";
import { fetchArticlesUseCase } from "./FetchArticlesUseCase";
import { ArticleMocks } from "./FetchArticlesUseCase.mocks";

describe("FetchArticlesUseCase", () => {
  it("should return an array of articles", async () => {
    mockServer.use(...ArticleMocks.Success);

    const offset = 0;
    const limit = 20;
    const result = await fetchArticlesUseCase(offset, limit);

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
