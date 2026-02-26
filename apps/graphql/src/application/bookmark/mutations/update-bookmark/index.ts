import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";

export type UpdateBookmarkInput = {
  title?: string;
  url?: string;
  description?: string;
  note?: string;
  thumbnail?: string;
  tagNames?: string[];
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
  return BookmarkRepository.withTransaction(async (repository) =>
    updateBookmarkUseCase({ id, input }, { repository }),
  );
};
