import { ServiceError } from "@getcronit/pylon";
import type { IUrlMetadataRepository } from "../../../../domain/url-metadata/interface";
import type { UrlMetadata } from "../../../../domain/url-metadata/model";
import { UrlMetadataRepository } from "../../../../domain/url-metadata/repository.external";

const fetchUrlMetadataUseCase = async (
  url: string,
  { repository }: { repository: IUrlMetadataRepository },
): Promise<UrlMetadata> => {
  try {
    new URL(url);
  } catch {
    throw new ServiceError("Invalid URL", {
      statusCode: 400,
      code: "BAD_REQUEST",
    });
  }

  try {
    return await repository.fetchMetadata(url);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(
      `Failed to fetch URL metadata: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const fetchUrlMetadata = async (url: string): Promise<UrlMetadata> => {
  const repository = new UrlMetadataRepository();
  return fetchUrlMetadataUseCase(url, { repository });
};
