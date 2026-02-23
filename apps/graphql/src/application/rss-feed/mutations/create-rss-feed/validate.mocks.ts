import { HttpResponse, http } from "msw";

const createRssXml = (title: string, description: string) => `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <item>
      <title>Test Article</title>
      <link>https://example.com/article</link>
    </item>
  </channel>
</rss>
`;

const createAtomXml = (title: string, subtitle: string) => `
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${title}</title>
  <subtitle>${subtitle}</subtitle>
  <entry>
    <title>Test Entry</title>
    <link href="https://example.com/entry"/>
  </entry>
</feed>
`;

export const FetchRssFeedMocks = {
  /** Valid RSS 2.0 feed with title "My Blog" and description */
  Rss: http.get("https://example.com/rss.xml", () =>
    HttpResponse.xml(createRssXml("My Blog", "A blog about things")),
  ),

  /** Valid Atom feed with title "My Atom Blog" and subtitle */
  Atom: http.get("https://example.com/atom.xml", () =>
    HttpResponse.xml(createAtomXml("My Atom Blog", "An Atom feed")),
  ),

  /** RSS feed with title only (no description field) */
  RssWithoutDescription: http.get("https://example.com/no-desc.xml", () =>
    HttpResponse.xml(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>No Desc Blog</title>
  </channel>
</rss>
    `),
  ),

  /** HTTP 404 not found response */
  NotFound: http.get(
    "https://example.com/not-found.xml",
    () => new HttpResponse(null, { status: 404 }),
  ),

  /** HTML page (not a valid RSS/Atom feed) */
  HtmlPage: http.get("https://example.com/page", () =>
    HttpResponse.html("<html><body>Not a feed</body></html>"),
  ),
};
