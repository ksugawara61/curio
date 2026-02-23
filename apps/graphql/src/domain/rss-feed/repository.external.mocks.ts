import { HttpResponse, http } from "msw";

type RssItem = {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  thumbnail?: string;
};

type AtomEntry = {
  title: string;
  link: string;
  summary?: string;
  published?: string;
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

const createAtomXml = (entries: AtomEntry[]) => `
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <title>Test Atom Feed</title>
  ${entries
    .map(
      (entry) => `
  <entry>
    <title>${entry.title}</title>
    <link href="${entry.link}"/>
    ${entry.summary ? `<summary>${entry.summary}</summary>` : ""}
    ${entry.published ? `<published>${entry.published}</published>` : ""}
    ${entry.thumbnail ? `<media:thumbnail url="${entry.thumbnail}"/>` : ""}
  </entry>`,
    )
    .join("")}
</feed>
`;

export const RssFeedExternalMocks = {
  /** RSS 2.0 feed with 2 items: Article 1 (with thumbnail) and Article 2 (without) */
  Rss: http.get("https://example.com/rss.xml", () =>
    HttpResponse.xml(
      createRssXml([
        {
          title: "Article 1",
          link: "https://example.com/1",
          description: "Description 1",
          pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
          thumbnail: "https://example.com/img1.jpg",
        },
        {
          title: "Article 2",
          link: "https://example.com/2",
          description: "Description 2",
          pubDate: "Tue, 02 Jan 2024 00:00:00 GMT",
        },
      ]),
    ),
  ),

  /** Atom feed with 1 entry including thumbnail */
  Atom: http.get("https://example.com/atom.xml", () =>
    HttpResponse.xml(
      createAtomXml([
        {
          title: "Entry 1",
          link: "https://example.com/entry/1",
          summary: "Summary 1",
          published: "2024-01-01T00:00:00Z",
          thumbnail: "https://example.com/thumb1.png",
        },
      ]),
    ),
  ),

  /** RSS with 1 item containing only required fields (title and link) */
  MinimalRssItem: http.get("https://example.com/minimal.xml", () =>
    HttpResponse.xml(
      createRssXml([
        { title: "Minimal Article", link: "https://example.com/minimal" },
      ]),
    ),
  ),

  /** RSS with image thumbnail via <enclosure> tag */
  WithEnclosure: http.get("https://example.com/enclosure.xml", () =>
    HttpResponse.xml(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Enclosure Feed</title>
    <item>
      <title>With Enclosure</title>
      <link>https://example.com/enc</link>
      <enclosure url="https://example.com/photo.jpg" type="image/jpeg" length="12345"/>
    </item>
  </channel>
</rss>
    `),
  ),

  /** RSS with image thumbnail via <media:content> tag */
  WithMediaContent: http.get("https://example.com/media-content.xml", () =>
    HttpResponse.xml(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Media Content Feed</title>
    <item>
      <title>With Media Content</title>
      <link>https://example.com/mc</link>
      <media:content url="https://example.com/media.png" medium="image" width="600" height="400"/>
    </item>
  </channel>
</rss>
    `),
  ),

  /** RSS feed with no items */
  Empty: http.get("https://example.com/empty.xml", () =>
    HttpResponse.xml(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Empty Feed</title>
  </channel>
</rss>
    `),
  ),

  /** RSS with CDATA-wrapped title and description fields */
  CdataRss: http.get("https://example.com/cdata-rss.xml", () =>
    HttpResponse.xml(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[CDATA Feed]]></title>
    <item>
      <title><![CDATA[CDATA Article Title]]></title>
      <link>https://example.com/cdata</link>
      <description><![CDATA[CDATA description text]]></description>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
    `),
  ),

  /** Atom with CDATA-wrapped title and summary fields */
  CdataAtom: http.get("https://example.com/cdata-atom.xml", () =>
    HttpResponse.xml(`
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title><![CDATA[CDATA Atom Feed]]></title>
  <entry>
    <title><![CDATA[CDATA Entry Title]]></title>
    <link href="https://example.com/cdata-entry"/>
    <summary><![CDATA[CDATA summary text]]></summary>
    <published>2024-01-01T00:00:00Z</published>
  </entry>
</feed>
    `),
  ),

  /** HTTP 500 error response */
  FetchError: http.get(
    "https://example.com/error.xml",
    () => new HttpResponse(null, { status: 500 }),
  ),
};
