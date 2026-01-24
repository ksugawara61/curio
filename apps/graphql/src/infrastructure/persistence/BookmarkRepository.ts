import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { createDb } from "../../libs/drizzle/client";
import { bookmarks, bookmarkTags, tags } from "../../libs/drizzle/schema";
import type {
  Bookmark,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "../domain/Bookmark";
import * as tagRepository from "./TagRepository";

export const findMany = async (): Promise<Bookmark[]> => {
  const db = createDb();
  const result = await db
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      description: bookmarks.description,
      created_at: bookmarks.created_at,
      updated_at: bookmarks.updated_at,
      tag_id: tags.id,
      tag_name: tags.name,
      tag_created_at: tags.created_at,
      tag_updated_at: tags.updated_at,
    })
    .from(bookmarks)
    .leftJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmark_id))
    .leftJoin(tags, eq(bookmarkTags.tag_id, tags.id))
    .orderBy(bookmarks.created_at);

  // Group bookmarks with their tags
  const bookmarkMap = new Map<string, Bookmark>();

  for (const row of result) {
    if (!bookmarkMap.has(row.id)) {
      bookmarkMap.set(row.id, {
        id: row.id,
        title: row.title,
        url: row.url,
        description: row.description,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
        tags: [],
      });
    }

    if (row.tag_id) {
      const bookmark = bookmarkMap.get(row.id);
      if (!bookmark) {
        throw new Error(`Bookmark with id ${row.id} not found in map`);
      }
      bookmark.tags = bookmark.tags || [];
      bookmark.tags.push({
        id: row.tag_id,
        name: row.tag_name ?? "",
        created_at: new Date(row.tag_created_at ?? 0),
        updated_at: new Date(row.tag_updated_at ?? 0),
      });
    }
  }

  return Array.from(bookmarkMap.values()).reverse(); // Reverse for desc order
};

export const findById = async (id: string): Promise<Bookmark | null> => {
  const db = createDb();
  const result = await db
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      description: bookmarks.description,
      created_at: bookmarks.created_at,
      updated_at: bookmarks.updated_at,
      tag_id: tags.id,
      tag_name: tags.name,
      tag_created_at: tags.created_at,
      tag_updated_at: tags.updated_at,
    })
    .from(bookmarks)
    .leftJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmark_id))
    .leftJoin(tags, eq(bookmarkTags.tag_id, tags.id))
    .where(eq(bookmarks.id, id));

  if (result.length === 0) {
    return null;
  }

  const firstRow = result[0];
  const bookmark: Bookmark = {
    id: firstRow.id,
    title: firstRow.title,
    url: firstRow.url,
    description: firstRow.description,
    created_at: new Date(firstRow.created_at),
    updated_at: new Date(firstRow.updated_at),
    tags: [],
  };

  for (const row of result) {
    if (row.tag_id) {
      bookmark.tags = bookmark.tags || [];
      bookmark.tags.push({
        id: row.tag_id,
        name: row.tag_name ?? "",
        created_at: new Date(row.tag_created_at ?? 0),
        updated_at: new Date(row.tag_updated_at ?? 0),
      });
    }
  }

  return bookmark;
};

export const create = async (input: CreateBookmarkInput): Promise<Bookmark> => {
  const db = createDb();
  return await db.transaction(async (tx) => {
    // First create or find tags (deduplicate tag names)
    const uniqueTagNames = input.tagNames ? [...new Set(input.tagNames)] : [];
    const tagEntities =
      uniqueTagNames.length > 0
        ? await Promise.all(
            uniqueTagNames.map((tagName) =>
              tagRepository.findOrCreateWithTx(tagName, tx),
            ),
          )
        : [];

    // Insert bookmark
    const [bookmark] = await tx
      .insert(bookmarks)
      .values({
        id: createId(),
        title: input.title,
        url: input.url,
        description: input.description,
      })
      .returning();

    // Insert bookmark-tag relationships
    if (tagEntities.length > 0) {
      await tx.insert(bookmarkTags).values(
        tagEntities.map((tag) => ({
          bookmark_id: bookmark.id,
          tag_id: tag.id,
        })),
      );
    }

    return {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      created_at: new Date(bookmark.created_at),
      updated_at: new Date(bookmark.updated_at),
      tags: tagEntities,
    };
  });
};

export const update = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  const db = createDb();
  return await db.transaction(async (tx) => {
    // Update bookmark data
    const updateData: Partial<typeof bookmarks.$inferInsert> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.url !== undefined) updateData.url = input.url;
    if (input.description !== undefined)
      updateData.description = input.description;

    // Always update the updated_at field
    updateData.updated_at = new Date().toISOString();

    const [updatedBookmark] = await tx
      .update(bookmarks)
      .set(updateData)
      .where(eq(bookmarks.id, id))
      .returning();

    if (!updatedBookmark) {
      throw new Error("No record was found");
    }

    // Handle tags if provided
    let tagEntities: Awaited<
      ReturnType<typeof tagRepository.findOrCreateWithTx>
    >[] = [];
    if (input.tagNames !== undefined) {
      // First create or find tags (deduplicate tag names)
      const uniqueTagNames = [...new Set(input.tagNames)];
      tagEntities = await Promise.all(
        uniqueTagNames.map((tagName) =>
          tagRepository.findOrCreateWithTx(tagName, tx),
        ),
      );

      // Remove existing relationships
      await tx.delete(bookmarkTags).where(eq(bookmarkTags.bookmark_id, id));

      // Insert new relationships
      if (tagEntities.length > 0) {
        await tx.insert(bookmarkTags).values(
          tagEntities.map((tag) => ({
            bookmark_id: id,
            tag_id: tag.id,
          })),
        );
      }
    } else {
      // If tags weren't provided, fetch current tags
      const currentTagResult = await tx
        .select({
          id: tags.id,
          name: tags.name,
          created_at: tags.created_at,
          updated_at: tags.updated_at,
        })
        .from(tags)
        .innerJoin(bookmarkTags, eq(tags.id, bookmarkTags.tag_id))
        .where(eq(bookmarkTags.bookmark_id, id));

      tagEntities = currentTagResult.map((row) => ({
        id: row.id,
        name: row.name,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      }));
    }

    return {
      id: updatedBookmark.id,
      title: updatedBookmark.title,
      url: updatedBookmark.url,
      description: updatedBookmark.description,
      created_at: new Date(updatedBookmark.created_at),
      updated_at: new Date(updatedBookmark.updated_at),
      tags: tagEntities,
    };
  });
};

export const deleteBookmark = async (id: string): Promise<void> => {
  const db = createDb();
  const result = await db
    .delete(bookmarks)
    .where(eq(bookmarks.id, id))
    .returning();

  if (result.length === 0) {
    throw new Error("No record was found");
  }
};
