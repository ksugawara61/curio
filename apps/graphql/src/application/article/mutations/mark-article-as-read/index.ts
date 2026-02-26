import { ServiceError } from "@getcronit/pylon";
import type { IArticlePersistenceRepository } from "../../../../domain/article/interface";
import type { PersistedArticle } from "../../../../domain/article/model";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";

const markArticleAsReadUseCase = async (
  id: string,
  { repository }: { repository: IArticlePersistenceRepository },
): Promise<PersistedArticle> => {
  try {
    return await repository.markAsRead(id);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No record was found")
    ) {
      throw new ServiceError("Article not found", {
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }
    throw new ServiceError(
      `Failed to mark article as read: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const markArticleAsRead = async (
  id: string,
): Promise<PersistedArticle> => {
  const repository = new ArticlePersistenceRepository(
    ContextRepository.create(),
    DrizzleRepository.create().getDb(),
  );
  return markArticleAsReadUseCase(id, { repository });
};
