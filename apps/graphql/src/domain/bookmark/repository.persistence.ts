import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import type { ContextRepository } from "../../shared/context";
import type { DrizzleDb, Transaction } from "../../shared/drizzle";
import { BasePersistenceRepository } from "../shared/base-persistence-repository";
import { TagRepository } from "../tag/repository.persistence";
import { tags } from "../tag/schema";
import type { CreateBookmarkInput, UpdateBookmarkInput } from "./interface";
import type { Bookmark } from "./model";
import { bookmarkRelations, bookmarks, bookmarkTags } from "./schema";

const bookmarkSelectFields = {
  id: bookmarks.id,
  title: bookmarks.title,
  url: bookmarks.url,
  description: bookmarks.description,
  note: bookmarks.note,
  thumbnail: bookmarks.thumbnail,
  archived_at: bookmarks.archived_at,
  created_at: bookmarks.created_at,
  updated_at: bookmarks.updated_at,
  tag_id: tags.id,
  tag_name: tags.name,
  tag_created_at: tags.created_at,
  tag_updated_at: tags.updated_at,
};

const rowToBookmark = (row: {
  id: string;
  title: string;
  url: string;
  description: string | null;
  note: string | null;
  thumbnail: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}): Bookmark => ({
  id: row.id,
  title: row.title,
  url: row.url,
  description: row.description,
  note: row.note,
  thumbnail: row.thumbnail,
  archived_at: row.archived_at ? new Date(row.archived_at) : null,
  created_at: new Date(row.created_at),
  updated_at: new Date(row.updated_at),
  tags: [],
  relatedBookmarks: [],
});

export class BookmarkRepository extends BasePersistenceRepository {
  private tagRepository: TagRepository;

  constructor(ctx: ContextRepository, db: DrizzleDb | Transaction) {
    super(ctx, db);
    this.tagRepository = new TagRepository(ctx, db);
  }

  async findMany(): Promise<Bookmark[]> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select(bookmarkSelectFields)
      .from(bookmarks)
      .leftJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmark_id))
      .leftJoin(tags, eq(bookmarkTags.tag_id, tags.id))
      .where(and(eq(bookmarks.user_id, userId), isNull(bookmarks.archived_at)))
      .orderBy(bookmarks.created_at);

    const bookmarkList = this.groupBookmarksWithTags(result);
    return this.attachRelatedBookmarks(bookmarkList);
  }

  async findManyArchived(): Promise<Bookmark[]> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select(bookmarkSelectFields)
      .from(bookmarks)
      .leftJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmark_id))
      .leftJoin(tags, eq(bookmarkTags.tag_id, tags.id))
      .where(
        and(eq(bookmarks.user_id, userId), isNotNull(bookmarks.archived_at)),
      )
      .orderBy(bookmarks.created_at);

    const bookmarkList = this.groupBookmarksWithTags(result);
    return this.attachRelatedBookmarks(bookmarkList);
  }

  async findById(id: string): Promise<Bookmark | null> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select(bookmarkSelectFields)
      .from(bookmarks)
      .leftJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmark_id))
      .leftJoin(tags, eq(bookmarkTags.tag_id, tags.id))
      .where(and(eq(bookmarks.id, id), eq(bookmarks.user_id, userId)));

    if (result.length === 0) {
      return null;
    }

    const firstRow = result[0];
    const bookmark = rowToBookmark(firstRow);

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

    const [bookmarkWithRelated] = await this.attachRelatedBookmarks([bookmark]);
    return bookmarkWithRelated ?? null;
  }

  async findByUrl(url: string): Promise<Bookmark | null> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select(bookmarkSelectFields)
      .from(bookmarks)
      .leftJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmark_id))
      .leftJoin(tags, eq(bookmarkTags.tag_id, tags.id))
      .where(and(eq(bookmarks.url, url), eq(bookmarks.user_id, userId)));

    if (result.length === 0) {
      return null;
    }

    const firstRow = result[0];
    const bookmark = rowToBookmark(firstRow);

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

    const [bookmarkWithRelated] = await this.attachRelatedBookmarks([bookmark]);
    return bookmarkWithRelated ?? null;
  }

  async create(input: CreateBookmarkInput): Promise<Bookmark> {
    // Check for duplicate URL
    const existingBookmark = await this.findByUrl(input.url);
    if (existingBookmark) {
      throw new Error("Bookmark with this URL already exists");
    }

    // First create or find tags (deduplicate tag names)
    const uniqueTagNames = input.tagNames ? [...new Set(input.tagNames)] : [];
    const tagEntities =
      uniqueTagNames.length > 0
        ? await Promise.all(
            uniqueTagNames.map((tagName) =>
              this.tagRepository.findOrCreate(tagName),
            ),
          )
        : [];

    // Insert bookmark
    const userId = this.contextRepository.getUserId();
    const [bookmark] = await this.db
      .insert(bookmarks)
      .values({
        id: createId(),
        user_id: userId,
        title: input.title,
        url: input.url,
        description: input.description,
        note: input.note,
        thumbnail: input.thumbnail,
      })
      .returning();

    // Insert bookmark-tag relationships
    if (tagEntities.length > 0) {
      await this.db.insert(bookmarkTags).values(
        tagEntities.map((tag) => ({
          bookmark_id: bookmark.id,
          tag_id: tag.id,
        })),
      );
    }

    // Insert related bookmark relationships (both directions for bidirectionality)
    const uniqueRelatedIds = input.relatedBookmarkIds
      ? [...new Set(input.relatedBookmarkIds)]
      : [];

    if (uniqueRelatedIds.length > 0) {
      const relationRows = uniqueRelatedIds.flatMap((relatedId) => [
        { source_bookmark_id: bookmark.id, related_bookmark_id: relatedId },
        { source_bookmark_id: relatedId, related_bookmark_id: bookmark.id },
      ]);
      await this.db.insert(bookmarkRelations).values(relationRows);
    }

    // Fetch related bookmarks for the response
    const relatedBookmarkList =
      uniqueRelatedIds.length > 0
        ? await this.fetchBookmarksWithTagsByIds(uniqueRelatedIds)
        : [];

    return {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      note: bookmark.note,
      thumbnail: bookmark.thumbnail,
      archived_at: bookmark.archived_at ? new Date(bookmark.archived_at) : null,
      created_at: new Date(bookmark.created_at),
      updated_at: new Date(bookmark.updated_at),
      tags: tagEntities,
      relatedBookmarks: relatedBookmarkList,
    };
  }

  async update(id: string, input: UpdateBookmarkInput): Promise<Bookmark> {
    // Check for duplicate URL (only if URL is being updated)
    if (input.url !== undefined) {
      const existingBookmark = await this.findByUrl(input.url);
      if (existingBookmark && existingBookmark.id !== id) {
        throw new Error("Bookmark with this URL already exists");
      }
    }

    // Update bookmark data
    const updateData: Partial<typeof bookmarks.$inferInsert> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.url !== undefined) updateData.url = input.url;
    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.note !== undefined) updateData.note = input.note;
    if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail;

    // Always update the updated_at field
    updateData.updated_at = new Date().toISOString();

    const userId = this.contextRepository.getUserId();
    const [updatedBookmark] = await this.db
      .update(bookmarks)
      .set(updateData)
      .where(and(eq(bookmarks.id, id), eq(bookmarks.user_id, userId)))
      .returning();

    if (!updatedBookmark) {
      throw new Error("No record was found");
    }

    // Handle tags if provided
    let tagEntities: Awaited<ReturnType<TagRepository["findOrCreate"]>>[] = [];
    if (input.tagNames !== undefined) {
      // First create or find tags (deduplicate tag names)
      const uniqueTagNames = [...new Set(input.tagNames)];
      tagEntities = await Promise.all(
        uniqueTagNames.map((tagName) =>
          this.tagRepository.findOrCreate(tagName),
        ),
      );

      // Remove existing relationships
      await this.db
        .delete(bookmarkTags)
        .where(eq(bookmarkTags.bookmark_id, id));

      // Insert new relationships
      if (tagEntities.length > 0) {
        await this.db.insert(bookmarkTags).values(
          tagEntities.map((tag) => ({
            bookmark_id: id,
            tag_id: tag.id,
          })),
        );
      }
    } else {
      // If tags weren't provided, fetch current tags
      const currentTagResult = await this.db
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

    // Handle related bookmarks if provided
    let relatedBookmarkList: Bookmark[] = [];
    if (input.relatedBookmarkIds !== undefined) {
      const uniqueRelatedIds = [...new Set(input.relatedBookmarkIds)];

      // Remove all existing relations for this bookmark (both directions)
      await this.db
        .delete(bookmarkRelations)
        .where(eq(bookmarkRelations.source_bookmark_id, id));
      await this.db
        .delete(bookmarkRelations)
        .where(eq(bookmarkRelations.related_bookmark_id, id));

      // Insert new relations (both directions)
      if (uniqueRelatedIds.length > 0) {
        const relationRows = uniqueRelatedIds.flatMap((relatedId) => [
          { source_bookmark_id: id, related_bookmark_id: relatedId },
          { source_bookmark_id: relatedId, related_bookmark_id: id },
        ]);
        await this.db.insert(bookmarkRelations).values(relationRows);
        relatedBookmarkList =
          await this.fetchBookmarksWithTagsByIds(uniqueRelatedIds);
      }
    } else {
      // Fetch current related bookmarks
      const currentRelations = await this.db
        .select({ related_bookmark_id: bookmarkRelations.related_bookmark_id })
        .from(bookmarkRelations)
        .where(eq(bookmarkRelations.source_bookmark_id, id));

      const relatedIds = currentRelations.map((r) => r.related_bookmark_id);
      if (relatedIds.length > 0) {
        relatedBookmarkList =
          await this.fetchBookmarksWithTagsByIds(relatedIds);
      }
    }

    return {
      id: updatedBookmark.id,
      title: updatedBookmark.title,
      url: updatedBookmark.url,
      description: updatedBookmark.description,
      note: updatedBookmark.note,
      thumbnail: updatedBookmark.thumbnail,
      archived_at: updatedBookmark.archived_at
        ? new Date(updatedBookmark.archived_at)
        : null,
      created_at: new Date(updatedBookmark.created_at),
      updated_at: new Date(updatedBookmark.updated_at),
      tags: tagEntities,
      relatedBookmarks: relatedBookmarkList,
    };
  }

  async archive(id: string): Promise<Bookmark> {
    const userId = this.contextRepository.getUserId();
    const now = new Date().toISOString();

    const [updatedBookmark] = await this.db
      .update(bookmarks)
      .set({
        archived_at: now,
        updated_at: now,
      })
      .where(and(eq(bookmarks.id, id), eq(bookmarks.user_id, userId)))
      .returning();

    if (!updatedBookmark) {
      throw new Error("No record was found");
    }

    const bookmark = await this.findById(id);
    if (!bookmark) {
      throw new Error("No record was found");
    }

    return bookmark;
  }

  async unarchive(id: string): Promise<Bookmark> {
    const userId = this.contextRepository.getUserId();
    const now = new Date().toISOString();

    const [updatedBookmark] = await this.db
      .update(bookmarks)
      .set({
        archived_at: null,
        updated_at: now,
      })
      .where(and(eq(bookmarks.id, id), eq(bookmarks.user_id, userId)))
      .returning();

    if (!updatedBookmark) {
      throw new Error("No record was found");
    }

    const bookmark = await this.findById(id);
    if (!bookmark) {
      throw new Error("No record was found");
    }

    return bookmark;
  }

  async deleteBookmark(id: string): Promise<void> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .delete(bookmarks)
      .where(and(eq(bookmarks.id, id), eq(bookmarks.user_id, userId)))
      .returning();

    if (result.length === 0) {
      throw new Error("No record was found");
    }
  }

  private groupBookmarksWithTags(
    result: {
      id: string;
      title: string;
      url: string;
      description: string | null;
      note: string | null;
      thumbnail: string | null;
      archived_at: string | null;
      created_at: string;
      updated_at: string;
      tag_id: string | null;
      tag_name: string | null;
      tag_created_at: string | null;
      tag_updated_at: string | null;
    }[],
  ): Bookmark[] {
    const bookmarkMap = new Map<string, Bookmark>();

    for (const row of result) {
      if (!bookmarkMap.has(row.id)) {
        bookmarkMap.set(row.id, rowToBookmark(row));
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
  }

  private async fetchBookmarksWithTagsByIds(
    ids: string[],
  ): Promise<Bookmark[]> {
    if (ids.length === 0) return [];

    const result = await this.db
      .select(bookmarkSelectFields)
      .from(bookmarks)
      .leftJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmark_id))
      .leftJoin(tags, eq(bookmarkTags.tag_id, tags.id))
      .where(inArray(bookmarks.id, ids));

    return this.groupBookmarksWithTags(result);
  }

  private async attachRelatedBookmarks(
    bookmarkList: Bookmark[],
  ): Promise<Bookmark[]> {
    if (bookmarkList.length === 0) return bookmarkList;

    const ids = bookmarkList.map((b) => b.id);

    // Fetch all relations where these bookmarks are the source
    const relations = await this.db
      .select({
        source_bookmark_id: bookmarkRelations.source_bookmark_id,
        related_bookmark_id: bookmarkRelations.related_bookmark_id,
      })
      .from(bookmarkRelations)
      .where(inArray(bookmarkRelations.source_bookmark_id, ids));

    // Collect unique related bookmark IDs
    const uniqueRelatedIds = [
      ...new Set(relations.map((r) => r.related_bookmark_id)),
    ];

    if (uniqueRelatedIds.length === 0) {
      for (const bookmark of bookmarkList) {
        bookmark.relatedBookmarks = [];
      }
      return bookmarkList;
    }

    // Fetch related bookmarks with their tags (no recursive related bookmark loading)
    const relatedBookmarksMap = new Map<string, Bookmark>();
    const relatedBookmarkRows =
      await this.fetchBookmarksWithTagsByIds(uniqueRelatedIds);
    for (const rb of relatedBookmarkRows) {
      relatedBookmarksMap.set(rb.id, rb);
    }

    // Attach related bookmarks to each main bookmark
    for (const bookmark of bookmarkList) {
      const relatedIds = relations
        .filter((r) => r.source_bookmark_id === bookmark.id)
        .map((r) => r.related_bookmark_id);

      bookmark.relatedBookmarks = relatedIds
        .map((rid) => relatedBookmarksMap.get(rid))
        .filter((rb): rb is Bookmark => rb !== undefined);
    }

    return bookmarkList;
  }
}
