import type { RssArticle, RssFeed, RssFeedBatchItem } from "./model";

export type CreateRssFeedInput = {
  url: string;
  title: string;
  description?: string;
};

export type IRssFeedRepository = {
  findAll(): Promise<RssFeed[]>;
  findAllForBatch(): Promise<RssFeedBatchItem[]>;
  findById(id: string): Promise<RssFeed | null>;
  findByUrl(url: string): Promise<RssFeed | null>;
  create(input: CreateRssFeedInput): Promise<RssFeed>;
  remove(id: string): Promise<void>;
};

export type IRssFeedExternalRepository = {
  fetchArticles(feedUrl: string): Promise<RssArticle[]>;
};
