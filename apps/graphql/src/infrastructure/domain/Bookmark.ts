import type { Tag } from "./Tag";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
  tags?: Tag[];
};

export type CreateBookmarkInput = {
  title: string;
  url: string;
  description?: string;
  tagNames?: string[];
};

export type UpdateBookmarkInput = {
  title?: string;
  url?: string;
  description?: string;
  tagNames?: string[];
};
