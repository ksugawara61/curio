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
