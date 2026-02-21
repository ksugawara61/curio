export type RssFeed = {
  id: string;
  url: string;
  title: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
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

export type PersistedArticle = {
  id: string;
  user_id: string;
  rss_feed_id: string;
  title: string;
  url: string;
  description?: string | null;
  thumbnail_url?: string | null;
  pub_date?: string | null;
  created_at: Date;
  updated_at: Date;
};

export type UpsertArticleInput = {
  user_id: string;
  rss_feed_id: string;
  title: string;
  url: string;
  description?: string | null;
  thumbnail_url?: string | null;
  pub_date?: string | null;
};
