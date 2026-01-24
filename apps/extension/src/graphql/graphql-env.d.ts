/* eslint-disable */
/* prettier-ignore */
/* biome-ignore lint: auto-generated file */

export type introspection_types = {
  Article: {
    kind: "OBJECT";
    name: "Article";
    fields: {
      body: {
        name: "body";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      created_at: {
        name: "created_at";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      id: {
        name: "id";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      tags: {
        name: "tags";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: {
            kind: "LIST";
            name: never;
            ofType: {
              kind: "NON_NULL";
              name: never;
              ofType: { kind: "OBJECT"; name: "Tag_1"; ofType: null };
            };
          };
        };
      };
      title: {
        name: "title";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      updated_at: {
        name: "updated_at";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      url: {
        name: "url";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      user: {
        name: "user";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "OBJECT"; name: "User"; ofType: null };
        };
      };
    };
  };
  Bookmark: {
    kind: "OBJECT";
    name: "Bookmark";
    fields: {
      created_at: {
        name: "created_at";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "DateTimeISO"; ofType: null };
        };
      };
      description: {
        name: "description";
        type: { kind: "SCALAR"; name: "String"; ofType: null };
      };
      id: {
        name: "id";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      tags: {
        name: "tags";
        type: {
          kind: "LIST";
          name: never;
          ofType: {
            kind: "NON_NULL";
            name: never;
            ofType: { kind: "OBJECT"; name: "Tag"; ofType: null };
          };
        };
      };
      title: {
        name: "title";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      updated_at: {
        name: "updated_at";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "DateTimeISO"; ofType: null };
        };
      };
      url: {
        name: "url";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
    };
  };
  Boolean: unknown;
  CreateBookmarkInput: {
    kind: "INPUT_OBJECT";
    name: "CreateBookmarkInput";
    isOneOf: false;
    inputFields: [
      {
        name: "title";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
        defaultValue: null;
      },
      {
        name: "url";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
        defaultValue: null;
      },
      {
        name: "description";
        type: { kind: "SCALAR"; name: "String"; ofType: null };
        defaultValue: null;
      },
      {
        name: "tagNames";
        type: {
          kind: "LIST";
          name: never;
          ofType: {
            kind: "NON_NULL";
            name: never;
            ofType: { kind: "SCALAR"; name: "String"; ofType: null };
          };
        };
        defaultValue: null;
      },
    ];
  };
  CreateTagInput: {
    kind: "INPUT_OBJECT";
    name: "CreateTagInput";
    isOneOf: false;
    inputFields: [
      {
        name: "name";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
        defaultValue: null;
      },
    ];
  };
  DateTimeISO: unknown;
  Float: unknown;
  Mutation: {
    kind: "OBJECT";
    name: "Mutation";
    fields: {
      createBookmark: {
        name: "createBookmark";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "OBJECT"; name: "Bookmark"; ofType: null };
        };
      };
      createTag: {
        name: "createTag";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "OBJECT"; name: "Tag"; ofType: null };
        };
      };
      deleteBookmark: {
        name: "deleteBookmark";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "Boolean"; ofType: null };
        };
      };
      updateBookmark: {
        name: "updateBookmark";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "OBJECT"; name: "Bookmark"; ofType: null };
        };
      };
    };
  };
  Query: {
    kind: "OBJECT";
    name: "Query";
    fields: {
      articles: {
        name: "articles";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: {
            kind: "LIST";
            name: never;
            ofType: {
              kind: "NON_NULL";
              name: never;
              ofType: { kind: "OBJECT"; name: "Article"; ofType: null };
            };
          };
        };
      };
      bookmark: {
        name: "bookmark";
        type: { kind: "OBJECT"; name: "Bookmark"; ofType: null };
      };
      bookmarks: {
        name: "bookmarks";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: {
            kind: "LIST";
            name: never;
            ofType: {
              kind: "NON_NULL";
              name: never;
              ofType: { kind: "OBJECT"; name: "Bookmark"; ofType: null };
            };
          };
        };
      };
      tags: {
        name: "tags";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: {
            kind: "LIST";
            name: never;
            ofType: {
              kind: "NON_NULL";
              name: never;
              ofType: { kind: "OBJECT"; name: "Tag"; ofType: null };
            };
          };
        };
      };
    };
  };
  String: unknown;
  Tag: {
    kind: "OBJECT";
    name: "Tag";
    fields: {
      created_at: {
        name: "created_at";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "DateTimeISO"; ofType: null };
        };
      };
      id: {
        name: "id";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      name: {
        name: "name";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
      updated_at: {
        name: "updated_at";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "DateTimeISO"; ofType: null };
        };
      };
    };
  };
  Tag_1: {
    kind: "OBJECT";
    name: "Tag_1";
    fields: {
      name: {
        name: "name";
        type: {
          kind: "NON_NULL";
          name: never;
          ofType: { kind: "SCALAR"; name: "String"; ofType: null };
        };
      };
    };
  };
  UpdateBookmarkInput: {
    kind: "INPUT_OBJECT";
    name: "UpdateBookmarkInput";
    isOneOf: false;
    inputFields: [
      {
        name: "title";
        type: { kind: "SCALAR"; name: "String"; ofType: null };
        defaultValue: null;
      },
      {
        name: "url";
        type: { kind: "SCALAR"; name: "String"; ofType: null };
        defaultValue: null;
      },
      {
        name: "description";
        type: { kind: "SCALAR"; name: "String"; ofType: null };
        defaultValue: null;
      },
      {
        name: "tagNames";
        type: {
          kind: "LIST";
          name: never;
          ofType: {
            kind: "NON_NULL";
            name: never;
            ofType: { kind: "SCALAR"; name: "String"; ofType: null };
          };
        };
        defaultValue: null;
      },
    ];
  };
  User: {
    kind: "OBJECT";
    name: "User";
    fields: {
      name: {
        name: "name";
        type: { kind: "SCALAR"; name: "String"; ofType: null };
      };
    };
  };
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: "Query";
  mutation: "Mutation";
  subscription: never;
  types: introspection_types;
};

import * as gqlTada from "gql.tada";

declare module "gql.tada" {
  interface setupSchema {
    introspection: introspection;
  }
}
