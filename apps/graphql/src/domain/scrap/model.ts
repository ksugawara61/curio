import type { Bookmark } from "../bookmark/model";

export type Scrap = {
  id: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  bookmarks?: Bookmark[];
};
