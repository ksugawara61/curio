import type { Scrap } from "./model";

export type CreateScrapInput = {
  title: string;
  content: string;
  bookmarkIds?: string[];
};

export type UpdateScrapInput = {
  title?: string;
  content?: string;
  bookmarkIds?: string[];
};

export type IScrapRepository = {
  findMany(): Promise<Scrap[]>;
  findById(id: string): Promise<Scrap | null>;
  create(input: CreateScrapInput): Promise<Scrap>;
  update(id: string, input: UpdateScrapInput): Promise<Scrap>;
  deleteScrap(id: string): Promise<void>;
};
