import { ServiceError } from "@getcronit/pylon";
import type { IArticlePersistenceRepository } from "../../../../domain/article/interface";
import type {
  GetRecentArticlesInput,
  PersistedArticle,
} from "../../../../domain/article/model";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export class GetRecentArticles
  implements BaseApplication<GetRecentArticlesInput, PersistedArticle[]>
{
  constructor(
    private readonly repository: IArticlePersistenceRepository,
    private readonly userId: string,
  ) {}

  async invoke(input: GetRecentArticlesInput): Promise<PersistedArticle[]> {
    try {
      return await this.repository.findManyWithinPeriod(this.userId, input);
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
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  const repository = new ArticlePersistenceRepository();
  return new GetRecentArticles(repository, userId).invoke({ hours });
};
