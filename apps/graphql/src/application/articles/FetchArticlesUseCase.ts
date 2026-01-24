import { ServiceError } from "@getcronit/pylon";
import type { Article } from "../../infrastructure/domain/Article";
import * as articleRepository from "../../infrastructure/external/ArticleRepository";

export const fetchArticlesUseCase = async (
  offset = 0,
  limit = 20,
): Promise<Article[]> => {
  try {
    return await articleRepository.fetchArticles(offset, limit);
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
