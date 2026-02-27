import type { Tag } from "../tag/model";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  note?: string | null;
  thumbnail?: string | null;
  archived_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  tags?: Tag[];
  relatedBookmarks?: Bookmark[];
};
