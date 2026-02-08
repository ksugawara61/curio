import type { Article } from "./model";

export type IArticleRepository = {
  fetchArticles(offset?: number, limit?: number): Promise<Article[]>;
};
