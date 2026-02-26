import type {
  GetRecentArticlesInput,
  PersistedArticle,
  QiitaArticle,
  UpsertArticleInput,
} from "./model";

export type IArticleExternalRepository = {
  fetchArticles(offset?: number, limit?: number): Promise<QiitaArticle[]>;
};

export type IArticlePersistenceRepository = {
  upsert(input: UpsertArticleInput): Promise<void>;
  findManyWithinPeriod(
    userId: string,
    input: GetRecentArticlesInput,
  ): Promise<PersistedArticle[]>;
};
