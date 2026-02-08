import type { CreateTagInput, Tag, UpdateTagInput } from "./model";

export type ITagRepository = {
  findAll(): Promise<Tag[]>;
  findById(id: string): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  create(input: CreateTagInput): Promise<Tag>;
  findOrCreate(name: string): Promise<Tag>;
  update(id: string, input: UpdateTagInput): Promise<Tag>;
  remove(id: string): Promise<void>;
};
