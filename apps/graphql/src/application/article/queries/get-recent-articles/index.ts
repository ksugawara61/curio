import { ServiceError } from "@getcronit/pylon";
import type { IArticlePersistenceRepository } from "../../../../domain/article/interface";
import type {
  GetRecentArticlesInput,
  PersistedArticle,
} from "../../../../domain/article/model";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";

const getRecentArticlesUseCase = async (
  input: GetRecentArticlesInput,
  {
    repository,
    contextRepository,
  }: {
    repository: IArticlePersistenceRepository;
    contextRepository: ContextRepository;
  },
): Promise<PersistedArticle[]> => {
  try {
    const userId = contextRepository.getUserId();
    return await repository.findManyWithinPeriod(userId, input);
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch recent articles: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const recentArticles = async (
  hours = 48,
): Promise<PersistedArticle[]> => {
  const repository = new ArticlePersistenceRepository(
    DrizzleRepository.create().getDb(),
  );
  return getRecentArticlesUseCase(
    { hours },
    { repository, contextRepository: ContextRepository.create() },
  );
};
