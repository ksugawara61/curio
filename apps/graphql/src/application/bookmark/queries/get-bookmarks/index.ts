import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";

const getBookmarksUseCase = async ({
  repository,
}: {
  repository: IBookmarkRepository;
}): Promise<Bookmark[]> => {
  try {
    return await repository.findMany();
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch bookmarks: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const bookmarks = async (): Promise<Bookmark[]> => {
  const repository = new BookmarkRepository(
    ContextRepository.create(),
    DrizzleRepository.create().getDb(),
  );
  return getBookmarksUseCase({ repository });
};
