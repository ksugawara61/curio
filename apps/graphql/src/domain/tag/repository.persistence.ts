import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import type { ContextRepository } from "../../shared/context";
import type { DrizzleDb, Transaction } from "../../shared/drizzle";
import type { CreateTagInput, Tag, UpdateTagInput } from "./model";
import { tags } from "./schema";

export class TagRepository {
  private db: DrizzleDb | Transaction;
  private contextRepository: ContextRepository;

  constructor(
    contextRepository: ContextRepository,
    dbOrTx: DrizzleDb | Transaction,
  ) {
    this.contextRepository = contextRepository;
    this.db = dbOrTx;
  }

  async findAll(): Promise<Tag[]> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select()
      .from(tags)
      .where(eq(tags.user_id, userId))
      .orderBy(tags.name);

    return result.map((tag) => ({
      id: tag.id,
      name: tag.name,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    }));
  }

  async findById(id: string): Promise<Tag | null> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select()
      .from(tags)
      .where(and(eq(tags.id, id), eq(tags.user_id, userId)))
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
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select()
      .from(tags)
      .where(and(eq(tags.name, name), eq(tags.user_id, userId)))
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
    const userId = this.contextRepository.getUserId();
    const [tag] = await this.db
      .insert(tags)
      .values({ id: createId(), user_id: userId, name: input.name })
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
    const userId = this.contextRepository.getUserId();
    const updateData = { ...input, updated_at: new Date().toISOString() };
    const [tag] = await this.db
      .update(tags)
      .set(updateData)
      .where(and(eq(tags.id, id), eq(tags.user_id, userId)))
      .returning();

    return {
      id: tag.id,
      name: tag.name,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    };
  }

  async remove(id: string): Promise<void> {
    const userId = this.contextRepository.getUserId();
    await this.db
      .delete(tags)
      .where(and(eq(tags.id, id), eq(tags.user_id, userId)));
  }
}
