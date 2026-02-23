export type Tag = {
  name: string;
};

export type User = {
  name: string | null;
};

export type Article = {
  id: string;
  title: string;
  body: string;
  url: string;
  user: User;
  tags: Tag[];
  created_at: string;
  updated_at: string;
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

export type GetRecentArticlesInput = {
  hours: number;
};
