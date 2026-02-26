import { createQiitaApiClient } from "../../shared/openapi/client";
import type { IArticleExternalRepository } from "./interface";
import type { QiitaArticle } from "./model";

export class ArticleExternalRepository implements IArticleExternalRepository {
  client: ReturnType<typeof createQiitaApiClient>;

  constructor() {
    this.client = createQiitaApiClient();
  }

  async fetchArticles(offset = 0, limit = 20): Promise<QiitaArticle[]> {
    // Qiita API uses page-based pagination, so we need to convert offset/limit to page
    const page = Math.floor(offset / limit) + 1;
    const perPage = limit;

    const response = await this.client.GET("/items", {
      params: {
        query: {
          page,
          per_page: perPage,
        },
      },
    });

    const items = response.data || [];

    // Calculate the actual offset within the page
    const pageOffset = offset % limit;

    // Return the subset of items based on the actual offset and limit
    return items.slice(pageOffset, pageOffset + limit).map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      url: item.url,
      user: {
        name: item.user?.name,
      },
      tags: item.tags.map((tag) => ({
        name: tag.name,
      })),
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  }
}
