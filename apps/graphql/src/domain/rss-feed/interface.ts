import type { CreateRssFeedInput, RssFeed, RssFeedBatchItem } from "./model";

export type IRssFeedRepository = {
  findAll(): Promise<RssFeed[]>;
  findById(id: string): Promise<RssFeed | null>;
  findByUrl(url: string): Promise<RssFeed | null>;
  create(input: CreateRssFeedInput): Promise<RssFeed>;
  remove(id: string): Promise<void>;
};

export type IRssFeedBatchRepository = {
  findAll(): Promise<RssFeedBatchItem[]>;
};
