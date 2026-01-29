/**
 * Sync articles from the API to local markdown files
 * Run this before building the site to get the latest published articles
 */

const API_URL = "https://growthgear-api.andrew-705.workers.dev";
const SITE_ID = "sales";

interface Article {
  id: number;
  slug: string;
  title: string;
  meta_description: string;
  primary_keyword: string;
  content: string;
  word_count: number;
  featured_image: string | null;
  published_at: string;
}

async function syncArticles() {
  console.log("Fetching articles from API...");

  const response = await fetch(
    `${API_URL}/api/public/articles?site_id=${SITE_ID}`
  );
  const data = await response.json();

  if (!data.success) {
    console.error("Failed to fetch articles:", data.error);
    process.exit(1);
  }

  const articles: Article[] = data.data;
  console.log(`Found ${articles.length} published articles`);

  const fs = await import("fs/promises");
  const path = await import("path");

  const contentDir = path.join(
    import.meta.dirname,
    "..",
    "src",
    "content",
    "articles"
  );

  // Ensure directory exists
  await fs.mkdir(contentDir, { recursive: true });

  for (const article of articles) {
    const publishedDate = new Date(article.published_at);
    const dateStr = publishedDate.toISOString().split("T")[0];

    // Generate frontmatter matching the content schema
    const imageBlock = article.featured_image
      ? `image:
  src: "${API_URL}/api/images/${article.featured_image}"
  alt: "${article.title.replace(/"/g, '\\"')}"`
      : "";

    const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${article.meta_description.replace(/"/g, '\\"')}"
publishedAt: ${dateStr}
category: "sales"
author:
  name: "Sales Mastery Team"
tags: ["${article.primary_keyword.replace(/"/g, '\\"')}"]
isSponsored: false
${imageBlock}
---`;

    const markdown = `${frontmatter}

${article.content}
`;

    const filename = `${article.slug}.md`;
    const filepath = path.join(contentDir, filename);

    await fs.writeFile(filepath, markdown, "utf-8");
    console.log(`  Written: ${filename}`);
  }

  console.log("Sync complete!");
}

syncArticles().catch(console.error);
