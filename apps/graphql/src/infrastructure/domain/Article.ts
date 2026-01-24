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
