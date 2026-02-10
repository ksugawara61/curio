import { z } from "zod";

const getTagContent = (xml: string, tagName: string): string | undefined => {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`);
  const match = xml.match(regex);
  return match?.[1]?.trim();
};

const parseRss = (xml: string) => {
  const channel = getTagContent(xml, "channel");
  if (!channel) return null;

  const title = getTagContent(channel, "title");
  if (!title) return null;

  return { title, description: getTagContent(channel, "description") };
};

const parseAtom = (xml: string) => {
  const title = getTagContent(xml, "title");
  if (!title) return null;

  return { title, description: getTagContent(xml, "subtitle") };
};

const parseFeedXml = (xml: string) => parseRss(xml) ?? parseAtom(xml) ?? null;

export const rssFeedUrlSchema = z
  .string()
  .url("Invalid URL format")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL must use http or https protocol" },
  );

type RssFeedMeta = {
  title: string;
  description?: string;
};

export const fetchAndValidateRssFeed = async (
  url: string,
): Promise<RssFeedMeta> => {
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
  const meta = parseFeedXml(text);

  if (!meta) {
    throw new Error("The URL does not point to a valid RSS or Atom feed");
  }

  return meta;
};
