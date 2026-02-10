import { ServiceError } from "@getcronit/pylon";
import type { RssFeed } from "../../../../domain/rss-feed/model";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { fetchAndValidateRssFeed, rssFeedUrlSchema } from "./validate";

export const createRssFeed = async (url: string): Promise<RssFeed> => {
  const urlResult = rssFeedUrlSchema.safeParse(url);
  if (!urlResult.success) {
    throw new ServiceError(urlResult.error.errors[0].message, {
      statusCode: 400,
      code: "BAD_REQUEST",
    });
  }

  let meta: { title: string; description?: string };
  try {
    meta = await fetchAndValidateRssFeed(urlResult.data);
  } catch (error) {
    throw new ServiceError(
      `Invalid RSS feed URL: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 400,
        code: "BAD_REQUEST",
      },
    );
  }

  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();

  try {
    return await db.transaction(async (tx) => {
      const repository = new RssFeedRepository(userId, tx);
      return await repository.create({
        url: urlResult.data,
        title: meta.title,
        description: meta.description,
      });
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("is already registered")
    ) {
      throw new ServiceError(error.message, {
        statusCode: 409,
        code: "CONFLICT",
      });
    }
    throw new ServiceError(
      `Failed to create RSS feed: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
