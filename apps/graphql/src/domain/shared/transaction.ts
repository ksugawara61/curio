import { DrizzleRepository, type Transaction } from "../../shared/drizzle";

export type { Transaction };

/**
 * Runs `fn` inside a single database transaction.
 *
 * Each repository has a static `inTransaction(tx)` factory method.
 * Pass `tx` to the repositories you need — only those repositories
 * participate in the transaction, and adding new repositories never
 * requires touching this file.
 *
 * @example Single repository
 * ```ts
 * return withTransaction(async (tx) =>
 *   createBookmarkUseCase(input, { repository: BookmarkRepository.inTransaction(tx) }),
 * );
 * ```
 *
 * @example Multiple repositories in one atomic operation
 * ```ts
 * return withTransaction(async (tx) => {
 *   const feed = await RssFeedRepository.inTransaction(tx).create(feedInput);
 *   return BookmarkRepository.inTransaction(tx).create({ ...bookmarkInput, url: feed.url });
 * });
 * ```
 */
export const withTransaction = <T>(
  fn: (tx: Transaction) => Promise<T>,
): Promise<T> => DrizzleRepository.create().transaction(fn);
