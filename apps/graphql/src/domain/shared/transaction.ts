import { ContextRepository } from "../../shared/context";
import { DrizzleRepository } from "../../shared/drizzle";
import { ArticlePersistenceRepository } from "../article/repository.persistence";
import { BookmarkRepository } from "../bookmark/repository.persistence";
import { RssFeedRepository } from "../rss-feed/repository.persistence";
import { TagRepository } from "../tag/repository.persistence";

/**
 * All persistence repositories scoped to a single database transaction.
 * Use this type as the parameter of the callback passed to `withTransaction`.
 */
export type TransactionRepositories = {
  bookmark: BookmarkRepository;
  tag: TagRepository;
  rssFeed: RssFeedRepository;
  article: ArticlePersistenceRepository;
};

/**
 * Runs `fn` inside a single database transaction.
 *
 * All repositories provided to `fn` share the same transaction, so writes
 * from multiple repositories are committed or rolled back atomically.
 *
 * @example Single repository
 * ```ts
 * return withTransaction(async ({ bookmark }) =>
 *   createBookmarkUseCase(input, { repository: bookmark }),
 * );
 * ```
 *
 * @example Multiple repositories in one atomic operation
 * ```ts
 * return withTransaction(async ({ bookmark, rssFeed }) => {
 *   const feed = await rssFeed.create(feedInput);
 *   return bookmark.create({ ...bookmarkInput, url: feed.url });
 * });
 * ```
 */
export const withTransaction = async <T>(
  fn: (repos: TransactionRepositories) => Promise<T>,
): Promise<T> => {
  return DrizzleRepository.create().transaction(async (tx) => {
    const ctx = ContextRepository.create();
    return fn({
      bookmark: new BookmarkRepository(ctx, tx),
      tag: new TagRepository(ctx, tx),
      rssFeed: new RssFeedRepository(ctx, tx),
      article: new ArticlePersistenceRepository(ctx, tx),
    });
  });
};
