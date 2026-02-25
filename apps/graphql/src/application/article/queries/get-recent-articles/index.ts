import { ServiceError } from "@getcronit/pylon";
import type { IArticlePersistenceRepository } from "../../../../domain/article/interface";
import type {
  GetRecentArticlesInput,
  PersistedArticle,
} from "../../../../domain/article/model";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import type { BaseApplication } from "../../../base";

export class GetRecentArticles
  implements BaseApplication<GetRecentArticlesInput, PersistedArticle[]>
{
  constructor(
    private readonly repository: IArticlePersistenceRepository,
    private readonly contextRepository: ContextRepository,
  ) {}

  async invoke(input: GetRecentArticlesInput): Promise<PersistedArticle[]> {
    try {
      const userId = this.contextRepository.getUserId();
      return await this.repository.findManyWithinPeriod(userId, input);
    } catch (error) {
      throw new ServiceError(
        `Failed to fetch recent articles: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const recentArticles = async (
  hours = 48,
): Promise<PersistedArticle[]> => {
  const repository = new ArticlePersistenceRepository(
    DrizzleRepository.create().getDb(),
  );
  return new GetRecentArticles(repository, ContextRepository.create()).invoke({
    hours,
  });
};
