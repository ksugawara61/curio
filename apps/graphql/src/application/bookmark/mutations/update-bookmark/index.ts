import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { withTransaction } from "../../../../domain/shared/transaction";

export type UpdateBookmarkInput = {
  title?: string;
  url?: string;
  description?: string;
  note?: string;
  thumbnail?: string;
  tagNames?: string[];
  relatedBookmarkIds?: string[];
};

const updateBookmarkUseCase = async (
  { id, input }: { id: string; input: UpdateBookmarkInput },
  { repository }: { repository: IBookmarkRepository },
): Promise<Bookmark> => {
  try {
    return await repository.update(id, input);
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
      `Failed to update bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const updateBookmark = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  return withTransaction(async (tx) =>
    updateBookmarkUseCase(
      { id, input },
      { repository: BookmarkRepository.inTransaction(tx) },
    ),
  );
};
