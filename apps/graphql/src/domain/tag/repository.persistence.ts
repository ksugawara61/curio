import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createDb } from "../../libs/drizzle/client";
import type * as schema from "../../libs/drizzle/schema";
import { tags } from "../../libs/drizzle/schema";
import type { CreateTagInput, Tag, UpdateTagInput } from "./model";

type Transaction = Parameters<
  Parameters<LibSQLDatabase<typeof schema>["transaction"]>[0]
>[0];

export class TagRepository {
  private db: LibSQLDatabase<typeof schema> | Transaction;
  private userId: string;

  constructor(
    userId: string,
    dbOrTx?: LibSQLDatabase<typeof schema> | Transaction,
  ) {
    this.userId = userId;
    this.db = dbOrTx ?? createDb();
  }

  async findAll(): Promise<Tag[]> {
    const result = await this.db
      .select()
      .from(tags)
      .where(eq(tags.user_id, this.userId))
      .orderBy(tags.name);

    return result.map((tag) => ({
      id: tag.id,
      name: tag.name,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    }));
  }

  async findById(id: string): Promise<Tag | null> {
    const result = await this.db
      .select()
      .from(tags)
      .where(and(eq(tags.id, id), eq(tags.user_id, this.userId)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const tag = result[0];
    return {
      id: tag.id,
      name: tag.name,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    };
  }

  async findByName(name: string): Promise<Tag | null> {
    const result = await this.db
      .select()
      .from(tags)
      .where(and(eq(tags.name, name), eq(tags.user_id, this.userId)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const tag = result[0];
    return {
      id: tag.id,
      name: tag.name,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    };
  }

  async create(input: CreateTagInput): Promise<Tag> {
    const [tag] = await this.db
      .insert(tags)
      .values({ id: createId(), user_id: this.userId, name: input.name })
      .returning();

    return {
      id: tag.id,
      name: tag.name,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    };
  }

  async findOrCreate(name: string): Promise<Tag> {
    const existingTag = await this.findByName(name);
    if (existingTag) {
      return existingTag;
    }

    return await this.create({ name });
  }

  async update(id: string, input: UpdateTagInput): Promise<Tag> {
    const updateData = { ...input, updated_at: new Date().toISOString() };
    const [tag] = await this.db
      .update(tags)
      .set(updateData)
      .where(and(eq(tags.id, id), eq(tags.user_id, this.userId)))
      .returning();

    return {
      id: tag.id,
      name: tag.name,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    };
  }

  async remove(id: string): Promise<void> {
    await this.db
      .delete(tags)
      .where(and(eq(tags.id, id), eq(tags.user_id, this.userId)));
  }
}
