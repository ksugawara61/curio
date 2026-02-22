import type { Article, UpsertArticleInput } from "./model";

export type IArticleRepository = {
  fetchArticles(offset?: number, limit?: number): Promise<Article[]>;
};

export type IArticlePersistenceRepository = {
  upsert(input: UpsertArticleInput): Promise<void>;
};
