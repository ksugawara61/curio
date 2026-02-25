import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import type { BaseApplication } from "../../../base";
import { bookmarkQuerySchema } from "./validate";

export type { BookmarkQueryInput } from "./validate";

type GetBookmarkInput = { id?: string; uri?: string };

export class GetBookmark
  implements BaseApplication<GetBookmarkInput, Bookmark | null>
{
  constructor(private readonly repository: IBookmarkRepository) {}

  async invoke({ id, uri }: GetBookmarkInput): Promise<Bookmark | null> {
    const result = bookmarkQuerySchema.safeParse({ id, uri });
    if (!result.success) {
      throw new ServiceError(result.error.errors[0].message, {
        statusCode: 400,
        code: "BAD_REQUEST",
      });
    }

    try {
      if (id) {
        return await this.repository.findById(id);
      }
      return await this.repository.findByUrl(uri as string);
    } catch (error) {
      throw new ServiceError(
        `Failed to fetch bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const bookmark = async (
  id?: string,
  uri?: string,
): Promise<Bookmark | null> => {
  const repository = new BookmarkRepository(
    ContextRepository.create(),
    DrizzleRepository.create().getDb(),
  );
  return new GetBookmark(repository).invoke({ id, uri });
};
