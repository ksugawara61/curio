import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
export type { CreateBookmarkInput };

const createBookmarkUseCase = async (
  input: CreateBookmarkInput,
  { repository }: { repository: IBookmarkRepository },
): Promise<Bookmark> => {
  try {
    return await repository.create(input);
  } catch (error) {
    throw new ServiceError(
      `Failed to create bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const createBookmark = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  return await DrizzleRepository.create().transaction(async (tx) => {
    const repository = new BookmarkRepository(ContextRepository.create(), tx);
    return createBookmarkUseCase(input, { repository });
  });
};
