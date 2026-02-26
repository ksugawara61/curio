export type QiitaArticleTag = {
  name: string;
};

export type QiitaArticleUser = {
  name: string | null;
};

export type QiitaArticle = {
  id: string;
  title: string;
  body: string;
  url: string;
  user: QiitaArticleUser;
  tags: QiitaArticleTag[];
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

export type ArticleSource = "qiita" | "database" | "rss";

export type Article = {
  id?: string | null;
  title: string;
  url: string;
  description?: string | null;
  thumbnail_url?: string | null;
  pub_date?: string | null;
  body?: string | null;
  author?: string | null;
  tags?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
  source: ArticleSource;
};
