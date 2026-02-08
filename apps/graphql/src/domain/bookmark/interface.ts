import type {
  Bookmark,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "./model";

export type IBookmarkRepository = {
  findMany(): Promise<Bookmark[]>;
  findById(id: string): Promise<Bookmark | null>;
  findByUrl(url: string): Promise<Bookmark | null>;
  create(input: CreateBookmarkInput): Promise<Bookmark>;
  update(id: string, input: UpdateBookmarkInput): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<void>;
};
