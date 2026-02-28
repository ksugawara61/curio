import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { FetchUrlMetadataQuery } from "./FetchUrlMetadataQuery";

export const FetchUrlMetadataQueryMocks = {
  Loading: createMockQuery(FetchUrlMetadataQuery, mockLoadingResolver),
  Success: createMockQuery(FetchUrlMetadataQuery, () => {
    return HttpResponse.json({
      data: {
        fetchUrlMetadata: {
          title: "React Native 公式ドキュメント",
          description:
            "React Native でモバイルアプリを構築するための公式ドキュメントです。",
          thumbnail: "https://example.com/thumbnail.jpg",
        },
      },
    });
  }),
  Empty: createMockQuery(FetchUrlMetadataQuery, () => {
    return HttpResponse.json({
      data: {
        fetchUrlMetadata: {
          title: null,
          description: null,
          thumbnail: null,
        },
      },
    });
  }),
};
