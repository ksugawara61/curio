import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";

const getArchivedBookmarksUseCase = async ({
  repository,
}: {
  repository: IBookmarkRepository;
}): Promise<Bookmark[]> => {
  try {
    return await repository.findManyArchived();
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch archived bookmarks: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const archivedBookmarks = async (): Promise<Bookmark[]> => {
  const repository = BookmarkRepository.create();
  return getArchivedBookmarksUseCase({ repository });
};
