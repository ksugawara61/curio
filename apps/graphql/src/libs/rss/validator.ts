export type RssFeedMeta = {
  title: string;
  description?: string;
};

const getTagContent = (xml: string, tagName: string): string | undefined => {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`);
  const match = xml.match(regex);
  return match?.[1]?.trim();
};

const parseRss = (xml: string): RssFeedMeta | null => {
  const channel = getTagContent(xml, "channel");
  if (!channel) {
    return null;
  }

  const title = getTagContent(channel, "title");
  if (!title) {
    return null;
  }

  return {
    title,
    description: getTagContent(channel, "description"),
  };
};

const parseAtom = (xml: string): RssFeedMeta | null => {
  const title = getTagContent(xml, "title");
  if (!title) {
    return null;
  }

  const subtitle = getTagContent(xml, "subtitle");

  return {
    title,
    description: subtitle,
  };
};

export const validateRssFeed = async (url: string): Promise<RssFeedMeta> => {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("URL must use http or https protocol");
  }

  const response = await fetch(url, {
    headers: {
      Accept:
        "application/rss+xml, application/atom+xml, application/xml, text/xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: HTTP ${response.status}`);
  }

  const text = await response.text();

  if (text.includes("<rss") || text.includes("<channel>")) {
    const meta = parseRss(text);
    if (meta) {
      return meta;
    }
  }

  if (
    text.includes("<feed") &&
    text.includes('xmlns="http://www.w3.org/2005/Atom"')
  ) {
    const meta = parseAtom(text);
    if (meta) {
      return meta;
    }
  }

  // Fallback: try both parsers
  const rssMeta = parseRss(text);
  if (rssMeta) {
    return rssMeta;
  }

  const atomMeta = parseAtom(text);
  if (atomMeta) {
    return atomMeta;
  }

  throw new Error("The URL does not point to a valid RSS or Atom feed");
};
