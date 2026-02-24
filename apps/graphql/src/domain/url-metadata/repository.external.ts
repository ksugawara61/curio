import type { UrlMetadata } from "./model";

const getMetaContent = (
  html: string,
  attribute: string,
  value: string,
): string | null => {
  const regex1 = new RegExp(
    `<meta[^>]+${attribute}=["']${value}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const regex2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+${attribute}=["']${value}["']`,
    "i",
  );
  return html.match(regex1)?.[1] ?? html.match(regex2)?.[1] ?? null;
};

const getTitleTag = (html: string): string | null => {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ?? null;
};

export class UrlMetadataRepository {
  async fetchMetadata(url: string): Promise<UrlMetadata> {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Curio/1.0; +https://curio.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return { title: null, description: null, thumbnail: null };
    }

    const html = await response.text();

    const title =
      getMetaContent(html, "property", "og:title") ??
      getMetaContent(html, "name", "twitter:title") ??
      getTitleTag(html);

    const description =
      getMetaContent(html, "property", "og:description") ??
      getMetaContent(html, "name", "description") ??
      getMetaContent(html, "name", "twitter:description");

    const thumbnail =
      getMetaContent(html, "property", "og:image") ??
      getMetaContent(html, "name", "twitter:image");

    return { title, description, thumbnail };
  }
}
