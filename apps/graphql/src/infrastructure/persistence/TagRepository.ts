import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createDb } from "../../libs/drizzle/client";
import type * as schema from "../../libs/drizzle/schema";
import { tags } from "../../libs/drizzle/schema";
import type { CreateTagInput, Tag, UpdateTagInput } from "../domain/Tag";

export const findAll = async (): Promise<Tag[]> => {
  const db = createDb();
  const result = await db.select().from(tags).orderBy(tags.name);

  return result.map((tag) => ({
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  }));
};

export const findById = async (id: string): Promise<Tag | null> => {
  const db = createDb();
  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);

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
};

export const findByName = async (name: string): Promise<Tag | null> => {
  const db = createDb();
  const result = await db
    .select()
    .from(tags)
    .where(eq(tags.name, name))
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
};

export const create = async (input: CreateTagInput): Promise<Tag> => {
  const db = createDb();
  const [tag] = await db
    .insert(tags)
    .values({ id: createId(), name: input.name })
    .returning();

  return {
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  };
};

export const findOrCreate = async (name: string): Promise<Tag> => {
  const existingTag = await findByName(name);
  if (existingTag) {
    return existingTag;
  }

  return await create({ name });
};

export const findOrCreateWithTx = async (
  name: string,
  tx: Parameters<
    Parameters<LibSQLDatabase<typeof schema>["transaction"]>[0]
  >[0],
): Promise<Tag> => {
  const existingTag = await tx
    .select()
    .from(tags)
    .where(eq(tags.name, name))
    .limit(1);

  if (existingTag.length > 0) {
    const tag = existingTag[0];
    return {
      id: tag.id,
      name: tag.name,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    };
  }

  const [tag] = await tx
    .insert(tags)
    .values({ id: createId(), name })
    .returning();

  return {
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  };
};

export const update = async (
  id: string,
  input: UpdateTagInput,
): Promise<Tag> => {
  const updateData = { ...input, updated_at: new Date().toISOString() };
  const db = createDb();
  const [tag] = await db
    .update(tags)
    .set(updateData)
    .where(eq(tags.id, id))
    .returning();

  return {
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  };
};

export const remove = async (id: string): Promise<void> => {
  const db = createDb();
  await db.delete(tags).where(eq(tags.id, id));
};
