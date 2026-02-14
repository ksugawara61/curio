import type {
  Bookmark,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "./model";

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
