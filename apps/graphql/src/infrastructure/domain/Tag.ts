export type Tag = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export type CreateTagInput = {
  name: string;
};

export type UpdateTagInput = {
  name?: string;
};
