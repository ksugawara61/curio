export type RssFeed = {
  id: string;
  url: string;
  title: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
};

export type RssFeedBatchItem = {
  id: string;
  user_id: string;
  url: string;
};

export type CreateRssFeedInput = {
  url: string;
  title: string;
  description?: string;
};

export type RssArticle = {
  title: string;
  link: string;
  description?: string | null;
  pubDate?: string | null;
  thumbnailUrl?: string | null;
};
