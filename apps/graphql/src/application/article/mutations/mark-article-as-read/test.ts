import { describe, expect, it } from "vitest";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { mockAuthContext } from "../../../../libs/test/authHelper";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { markArticleAsRead } from ".";

// ---- helpers ----

const setupFeedAndArticle = async (userId: string) => {
  mockAuthContext({ userId });
  const feed = await DrizzleRepository.create().transaction(async (tx) => {
    const feedRepo = new RssFeedRepository(ContextRepository.create(), tx);
    return feedRepo.create({
      url: "https://example.com/feed.xml",
      title: "Test Feed",
    });
  });

  const repo = new ArticlePersistenceRepository(
    DrizzleRepository.create().getDb(),
  );
  await repo.upsert({
    user_id: userId,
    rss_feed_id: feed.id,
    title: "Test Article",
    url: "https://example.com/article",
    pub_date: new Date().toISOString(),
  });

  const articles = await repo.findManyWithinPeriod(userId, { hours: 48 });
  const article = articles.find((a) => a.url === "https://example.com/article");
  if (!article) throw new Error("Article not found in setup");
  return article;
};

// ---- tests ----

describe("markArticleAsRead", () => {
  it("should set read_at on the article", async () => {
    const article = await setupFeedAndArticle("test-user");
    expect(article.read_at).toBeNull();

    const before = new Date();
    const result = await markArticleAsRead(article.id);
    const after = new Date();

    expect(result.id).toBe(article.id);
    expect(result.read_at).toBeInstanceOf(Date);
    expect(result.read_at?.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.read_at?.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("should throw NOT_FOUND for a non-existent article id", async () => {
    mockAuthContext({ userId: "test-user" });
    await expect(markArticleAsRead("non-existent-id")).rejects.toThrow(
      "Article not found",
    );
  });

  it("should throw NOT_FOUND when trying to mark another user's article as read", async () => {
    const article = await setupFeedAndArticle("user-a");

    // Switch to a different user
    mockAuthContext({ userId: "user-b" });
    await expect(markArticleAsRead(article.id)).rejects.toThrow(
      "Article not found",
    );
  });
});
