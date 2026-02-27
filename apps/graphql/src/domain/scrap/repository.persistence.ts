import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { bookmarks } from "../bookmark/schema";
import { BasePersistenceRepository } from "../shared/base-persistence-repository";
import type { CreateScrapInput, UpdateScrapInput } from "./interface";
import type { Scrap } from "./model";
import { scrapBookmarks, scraps } from "./schema";

const scrapSelectFields = {
  id: scraps.id,
  title: scraps.title,
  content: scraps.content,
  created_at: scraps.created_at,
  updated_at: scraps.updated_at,
  bookmark_id: bookmarks.id,
  bookmark_title: bookmarks.title,
  bookmark_url: bookmarks.url,
  bookmark_description: bookmarks.description,
  bookmark_note: bookmarks.note,
  bookmark_thumbnail: bookmarks.thumbnail,
  bookmark_archived_at: bookmarks.archived_at,
  bookmark_created_at: bookmarks.created_at,
  bookmark_updated_at: bookmarks.updated_at,
};

const rowToScrap = (row: {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}): Scrap => ({
  id: row.id,
  title: row.title,
  content: row.content,
  created_at: new Date(row.created_at),
  updated_at: new Date(row.updated_at),
  bookmarks: [],
});

export class ScrapRepository extends BasePersistenceRepository {
  async findMany(): Promise<Scrap[]> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select(scrapSelectFields)
      .from(scraps)
      .leftJoin(scrapBookmarks, eq(scraps.id, scrapBookmarks.scrap_id))
      .leftJoin(bookmarks, eq(scrapBookmarks.bookmark_id, bookmarks.id))
      .where(eq(scraps.user_id, userId))
      .orderBy(scraps.created_at);

    return this.groupScrapsWithBookmarks(result);
  }

  async findById(id: string): Promise<Scrap | null> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select(scrapSelectFields)
      .from(scraps)
      .leftJoin(scrapBookmarks, eq(scraps.id, scrapBookmarks.scrap_id))
      .leftJoin(bookmarks, eq(scrapBookmarks.bookmark_id, bookmarks.id))
      .where(and(eq(scraps.id, id), eq(scraps.user_id, userId)));

    if (result.length === 0) {
      return null;
    }

    const [grouped] = this.groupScrapsWithBookmarks(result);
    return grouped ?? null;
  }

  async create(input: CreateScrapInput): Promise<Scrap> {
    const userId = this.contextRepository.getUserId();
    const [scrap] = await this.db
      .insert(scraps)
      .values({
        id: createId(),
        user_id: userId,
        title: input.title,
        content: input.content,
      })
      .returning();

    const uniqueBookmarkIds = input.bookmarkIds
      ? [...new Set(input.bookmarkIds)]
      : [];

    if (uniqueBookmarkIds.length > 0) {
      await this.db.insert(scrapBookmarks).values(
        uniqueBookmarkIds.map((bookmarkId) => ({
          scrap_id: scrap.id,
          bookmark_id: bookmarkId,
        })),
      );
    }

    const attachedBookmarks =
      uniqueBookmarkIds.length > 0
        ? await this.fetchBookmarksByIds(uniqueBookmarkIds)
        : [];

    return {
      id: scrap.id,
      title: scrap.title,
      content: scrap.content,
      created_at: new Date(scrap.created_at),
      updated_at: new Date(scrap.updated_at),
      bookmarks: attachedBookmarks,
    };
  }

  async update(id: string, input: UpdateScrapInput): Promise<Scrap> {
    const updateData: Partial<typeof scraps.$inferInsert> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.content !== undefined) updateData.content = input.content;
    updateData.updated_at = new Date().toISOString();

    const userId = this.contextRepository.getUserId();
    const [updatedScrap] = await this.db
      .update(scraps)
      .set(updateData)
      .where(and(eq(scraps.id, id), eq(scraps.user_id, userId)))
      .returning();

    if (!updatedScrap) {
      throw new Error("No record was found");
    }

    let attachedBookmarks: Scrap["bookmarks"] = [];
    if (input.bookmarkIds !== undefined) {
      const uniqueBookmarkIds = [...new Set(input.bookmarkIds)];

      await this.db
        .delete(scrapBookmarks)
        .where(eq(scrapBookmarks.scrap_id, id));

      if (uniqueBookmarkIds.length > 0) {
        await this.db.insert(scrapBookmarks).values(
          uniqueBookmarkIds.map((bookmarkId) => ({
            scrap_id: id,
            bookmark_id: bookmarkId,
          })),
        );
        attachedBookmarks = await this.fetchBookmarksByIds(uniqueBookmarkIds);
      }
    } else {
      const currentRelations = await this.db
        .select({ bookmark_id: scrapBookmarks.bookmark_id })
        .from(scrapBookmarks)
        .where(eq(scrapBookmarks.scrap_id, id));

      const currentIds = currentRelations.map((r) => r.bookmark_id);
      if (currentIds.length > 0) {
        attachedBookmarks = await this.fetchBookmarksByIds(currentIds);
      }
    }

    return {
      id: updatedScrap.id,
      title: updatedScrap.title,
      content: updatedScrap.content,
      created_at: new Date(updatedScrap.created_at),
      updated_at: new Date(updatedScrap.updated_at),
      bookmarks: attachedBookmarks,
    };
  }

  async deleteScrap(id: string): Promise<void> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .delete(scraps)
      .where(and(eq(scraps.id, id), eq(scraps.user_id, userId)))
      .returning();

    if (result.length === 0) {
      throw new Error("No record was found");
    }
  }

  private groupScrapsWithBookmarks(
    result: {
      id: string;
      title: string;
      content: string;
      created_at: string;
      updated_at: string;
      bookmark_id: string | null;
      bookmark_title: string | null;
      bookmark_url: string | null;
      bookmark_description: string | null;
      bookmark_note: string | null;
      bookmark_thumbnail: string | null;
      bookmark_archived_at: string | null;
      bookmark_created_at: string | null;
      bookmark_updated_at: string | null;
    }[],
  ): Scrap[] {
    const scrapMap = new Map<string, Scrap>();

    for (const row of result) {
      if (!scrapMap.has(row.id)) {
        scrapMap.set(row.id, rowToScrap(row));
      }

      if (row.bookmark_id) {
        const scrap = scrapMap.get(row.id);
        if (!scrap) {
          throw new Error(`Scrap with id ${row.id} not found in map`);
        }
        scrap.bookmarks = scrap.bookmarks || [];
        scrap.bookmarks.push({
          id: row.bookmark_id,
          title: row.bookmark_title ?? "",
          url: row.bookmark_url ?? "",
          description: row.bookmark_description,
          note: row.bookmark_note,
          thumbnail: row.bookmark_thumbnail,
          archived_at: row.bookmark_archived_at
            ? new Date(row.bookmark_archived_at)
            : null,
          created_at: new Date(row.bookmark_created_at ?? 0),
          updated_at: new Date(row.bookmark_updated_at ?? 0),
        });
      }
    }

    return Array.from(scrapMap.values()).reverse();
  }

  private async fetchBookmarksByIds(ids: string[]) {
    if (ids.length === 0) return [];

    const result = await this.db
      .select({
        id: bookmarks.id,
        title: bookmarks.title,
        url: bookmarks.url,
        description: bookmarks.description,
        note: bookmarks.note,
        thumbnail: bookmarks.thumbnail,
        archived_at: bookmarks.archived_at,
        created_at: bookmarks.created_at,
        updated_at: bookmarks.updated_at,
      })
      .from(bookmarks)
      .where(inArray(bookmarks.id, ids));

    return result.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      description: row.description,
      note: row.note,
      thumbnail: row.thumbnail,
      archived_at: row.archived_at ? new Date(row.archived_at) : null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));
  }
}
