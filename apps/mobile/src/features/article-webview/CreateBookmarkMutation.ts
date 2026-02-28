import { graphql } from "@curio/graphql-client";

export const CreateBookmarkMutation = graphql(`
  mutation ArticleWebViewCreateBookmark($input: CreateBookmarkInputInput!) {
    createBookmark(input: $input) {
      __typename
      id
      title
      url
    }
  }
`);
