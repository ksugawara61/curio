import type { RssArticle } from "./model";

const getTagContent = (xml: string, tagName: string): string | undefined => {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`);
  const match = xml.match(regex);
  return match?.[1]?.trim();
};

const getAllTagContents = (xml: string, tagName: string): string[] => {
  const regex = new RegExp(`<${tagName}[^>]*>[\\s\\S]*?<\\/${tagName}>`, "g");
  return xml.match(regex) ?? [];
};

const getAttributeValue = (
  xml: string,
  tagName: string,
  attrName: string,
): string | undefined => {
  const regex = new RegExp(
    `<${tagName}[^>]*${attrName}="([^"]*)"[^>]*/?>`,
    "i",
  );
  const match = xml.match(regex);
  return match?.[1]?.trim();
};

const getAtomLink = (entry: string): string | undefined => {
  const linkMatch = entry.match(/<link[^>]*href="([^"]*)"[^>]*\/?>/);
  return linkMatch?.[1]?.trim();
};

const getThumbnailUrl = (xml: string): string | undefined => {
  // <media:thumbnail url="..."/>
  const mediaThumbnail = getAttributeValue(xml, "media:thumbnail", "url");
  if (mediaThumbnail) return mediaThumbnail;

  // <media:content url="..." medium="image"/> or <media:content url="..." type="image/..."/>
  const mediaContentMatch = xml.match(
    /<media:content[^>]*url="([^"]*)"[^>]*(?:medium="image"|type="image\/[^"]*")[^>]*\/?>/i,
  );
  if (mediaContentMatch?.[1]) return mediaContentMatch[1].trim();

  // <enclosure url="..." type="image/..."/>
  const enclosureMatch = xml.match(
    /<enclosure[^>]*url="([^"]*)"[^>]*type="image\/[^"]*"[^>]*\/?>/i,
  );
  if (enclosureMatch?.[1]) return enclosureMatch[1].trim();

  return undefined;
};

const parseRssItems = (xml: string): RssArticle[] => {
  const channel = getTagContent(xml, "channel");
  if (!channel) return [];

  const items = getAllTagContents(channel, "item");
  return items.map((item) => ({
    title: getTagContent(item, "title") ?? "",
    link: getTagContent(item, "link") ?? "",
    description: getTagContent(item, "description"),
    pubDate: getTagContent(item, "pubDate"),
    thumbnailUrl: getThumbnailUrl(item),
  }));
};

const parseAtomEntries = (xml: string): RssArticle[] => {
  const entries = getAllTagContents(xml, "entry");
  return entries.map((entry) => ({
    title: getTagContent(entry, "title") ?? "",
    link: getAtomLink(entry) ?? "",
    description:
      getTagContent(entry, "summary") ?? getTagContent(entry, "content"),
    pubDate:
      getTagContent(entry, "published") ?? getTagContent(entry, "updated"),
    thumbnailUrl: getThumbnailUrl(entry),
  }));
};

export class RssFeedExternalRepository {
  async fetchArticles(feedUrl: string): Promise<RssArticle[]> {
    const response = await fetch(feedUrl, {
      headers: {
        Accept:
          "application/rss+xml, application/atom+xml, application/xml, text/xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: HTTP ${response.status}`);
    }

    const xml = await response.text();

    const articles = parseRssItems(xml);
    if (articles.length > 0) return articles;

    return parseAtomEntries(xml);
  }
}
