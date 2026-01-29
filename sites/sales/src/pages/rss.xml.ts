import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "../config";

export async function GET(context: APIContext) {
  const articles = await getCollection("articles");
  const sortedArticles = articles.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );

  return rss({
    title: siteConfig.site.name,
    description: siteConfig.seo.defaultDescription,
    site: context.site || siteConfig.seo.siteUrl,
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishedAt,
      description: article.data.description,
      link: `/${article.data.category}/${article.slug}/`,
      categories: article.data.tags,
    })),
    customData: `<language>en-au</language>`,
  });
}
