import type { UrlMetadata } from "./model";

export type IUrlMetadataRepository = {
  fetchMetadata(url: string): Promise<UrlMetadata>;
};
