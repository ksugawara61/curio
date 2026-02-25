import { ServiceError } from "@getcronit/pylon";
import type { Article } from "../../../../domain/article/model";
import { ArticleExternalRepository } from "../../../../domain/article/repository.external";

export const articles = async (offset = 0, limit = 20): Promise<Article[]> => {
  try {
    const repository = new ArticleExternalRepository();
    return await repository.fetchArticles(offset, limit);
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch articles: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
