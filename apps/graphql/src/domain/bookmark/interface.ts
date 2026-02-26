import type { Bookmark } from "./model";

export type CreateBookmarkInput = {
  title: string;
  url: string;
  description?: string;
  note?: string;
  thumbnail?: string;
  tagNames?: string[];
};

export type UpdateBookmarkInput = {
  title?: string;
  url?: string;
  description?: string;
  note?: string;
  thumbnail?: string;
  tagNames?: string[];
};

export type IBookmarkRepository = {
  findMany(): Promise<Bookmark[]>;
  findManyArchived(): Promise<Bookmark[]>;
  findById(id: string): Promise<Bookmark | null>;
  findByUrl(url: string): Promise<Bookmark | null>;
  create(input: CreateBookmarkInput): Promise<Bookmark>;
  update(id: string, input: UpdateBookmarkInput): Promise<Bookmark>;
  archive(id: string): Promise<Bookmark>;
  unarchive(id: string): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<void>;
};
