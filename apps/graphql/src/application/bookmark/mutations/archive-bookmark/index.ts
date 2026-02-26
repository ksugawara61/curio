import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { withTransaction } from "../../../../domain/shared/transaction";

const archiveBookmarkUseCase = async (
  id: string,
  { repository }: { repository: IBookmarkRepository },
): Promise<Bookmark> => {
  try {
    return await repository.archive(id);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No record was found")
    ) {
      throw new ServiceError("Bookmark not found", {
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }
    throw new ServiceError(
      `Failed to archive bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const archiveBookmark = async (id: string): Promise<Bookmark> => {
  return withTransaction(async (tx) =>
    archiveBookmarkUseCase(id, {
      repository: BookmarkRepository.inTransaction(tx),
    }),
  );
};
