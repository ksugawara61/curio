import { HttpResponse, http } from "msw";

type RssItem = {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  thumbnail?: string;
};

const createRssXml = (items: RssItem[]) => `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Test Feed</title>
    <description>A test feed</description>
    ${items
      .map(
        (item) => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      ${item.description ? `<description>${item.description}</description>` : ""}
      ${item.pubDate ? `<pubDate>${item.pubDate}</pubDate>` : ""}
      ${item.thumbnail ? `<media:thumbnail url="${item.thumbnail}"/>` : ""}
    </item>`,
      )
      .join("")}
  </channel>
</rss>
`;

export const SyncAllRssFeedsMocks = {
  /** feed.xml with Article 1 (with thumbnail and pub date) and Article 2 */
  FeedWithTwoArticles: http.get("https://example.com/feed.xml", () =>
    HttpResponse.xml(
      createRssXml([
        {
          title: "Article 1",
          link: "https://example.com/article-1",
          description: "Description 1",
          pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
          thumbnail: "https://example.com/img1.jpg",
        },
        {
          title: "Article 2",
          link: "https://example.com/article-2",
          description: "Description 2",
        },
      ]),
    ),
  ),

  /** feed-a.xml with one article "A Article" for user-a */
  FeedA: http.get("https://example.com/feed-a.xml", () =>
    HttpResponse.xml(
      createRssXml([
        { title: "A Article", link: "https://example.com/a-article" },
      ]),
    ),
  ),

  /** feed-b.xml with one article "B Article" for user-b */
  FeedB: http.get("https://example.com/feed-b.xml", () =>
    HttpResponse.xml(
      createRssXml([
        { title: "B Article", link: "https://example.com/b-article" },
      ]),
    ),
  ),

  /** feed.xml with an article titled "Original Title" (before update) */
  FeedWithOriginalArticle: http.get("https://example.com/feed.xml", () =>
    HttpResponse.xml(
      createRssXml([
        {
          title: "Original Title",
          link: "https://example.com/article",
          description: "Original description",
        },
      ]),
    ),
  ),

  /** feed.xml with an article titled "Updated Title" (after update) */
  FeedWithUpdatedArticle: http.get("https://example.com/feed.xml", () =>
    HttpResponse.xml(
      createRssXml([
        {
          title: "Updated Title",
          link: "https://example.com/article",
          description: "Updated description",
        },
      ]),
    ),
  ),

  /** feed.xml with one item missing a link and one item with a link */
  FeedWithMissingLink: http.get("https://example.com/feed.xml", () =>
    HttpResponse.xml(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>No Link Article</title>
    </item>
    <item>
      <title>Has Link Article</title>
      <link>https://example.com/has-link</link>
    </item>
  </channel>
</rss>
    `),
  ),

  /** failing-feed.xml returning HTTP 500 */
  FailingFeed: http.get(
    "https://example.com/failing-feed.xml",
    () => new HttpResponse(null, { status: 500 }),
  ),

  /** ok-feed.xml with one "OK Article" */
  OkFeed: http.get("https://example.com/ok-feed.xml", () =>
    HttpResponse.xml(
      createRssXml([
        { title: "OK Article", link: "https://example.com/ok-article" },
      ]),
    ),
  ),
};
