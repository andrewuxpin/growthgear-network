import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig, categories } from "../config";

export const GET: APIRoute = async () => {
  const articles = await getCollection("articles");
  const siteUrl = siteConfig.seo.siteUrl;

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const categoryPages = categories.map((c) => `/${c.slug}`);

  const articlePages = articles.map(
    (article) => `/${article.data.category}/${article.slug}`
  );

  const allPages = [...staticPages, ...categoryPages, ...articlePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page}</loc>
    <changefreq>${page === "" ? "daily" : "weekly"}</changefreq>
    <priority>${page === "" ? "1.0" : page.includes("/") && page.split("/").length > 2 ? "0.7" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
