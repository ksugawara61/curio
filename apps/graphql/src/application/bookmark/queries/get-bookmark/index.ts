import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { bookmarkQuerySchema } from "./validate";

export type { BookmarkQueryInput } from "./validate";

const getBookmarkUseCase = async (
  { id, uri }: { id?: string; uri?: string },
  { repository }: { repository: IBookmarkRepository },
): Promise<Bookmark | null> => {
  const result = bookmarkQuerySchema.safeParse({ id, uri });
  if (!result.success) {
    throw new ServiceError(result.error.errors[0].message, {
      statusCode: 400,
      code: "BAD_REQUEST",
    });
  }

  try {
    if (id) {
      return await repository.findById(id);
    }
    return await repository.findByUrl(uri as string);
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const bookmark = async (
  id?: string,
  uri?: string,
): Promise<Bookmark | null> => {
  const repository = new BookmarkRepository(
    ContextRepository.create(),
    DrizzleRepository.create().getDb(),
  );
  return getBookmarkUseCase({ id, uri }, { repository });
};
