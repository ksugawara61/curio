import type {
  Article,
  GetRecentArticlesInput,
  PersistedArticle,
  UpsertArticleInput,
} from "./model";

export type IArticleExternalRepository = {
  fetchArticles(offset?: number, limit?: number): Promise<Article[]>;
};

export type IArticlePersistenceRepository = {
  upsert(input: UpsertArticleInput): Promise<void>;
  findManyWithinPeriod(
    userId: string,
    input: GetRecentArticlesInput,
  ): Promise<PersistedArticle[]>;
};
