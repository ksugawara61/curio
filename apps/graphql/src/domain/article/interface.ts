import type { PersistedArticle, QiitaArticle } from "./model";

export type UpsertArticleInput = {
  user_id: string;
  rss_feed_id: string;
  title: string;
  url: string;
  description?: string | null;
  thumbnail_url?: string | null;
  pub_date?: string | null;
};

export type GetRecentArticlesInput = {
  hours: number;
};

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
