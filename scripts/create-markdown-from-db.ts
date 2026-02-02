#!/usr/bin/env npx tsx
/**
 * Creates markdown files from the database export JSON
 * Usage: npx tsx scripts/create-markdown-from-db.ts /path/to/articles.json
 */

import * as fs from "fs";
import * as path from "path";

const API_URL = "https://growthgear-api.andrew-705.workers.dev";

interface Article {
  id: number;
  site_id: string;
  slug: string;
  title: string;
  meta_description: string;
  category: string;
  content: string;
  word_count: number;
  featured_image: string | null;
  image_alt: string | null;
  published_at: string;
  is_sponsored: number;
}

interface WranglerOutput {
  results: Article[];
}

function escapeYaml(str: string): string {
  if (!str) return "";
  // Escape quotes and newlines for YAML
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function generateFrontmatter(article: Article): string {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  let imageYaml = "";
  if (article.featured_image) {
    const imageUrl = article.featured_image.startsWith("http")
      ? article.featured_image
      : `${API_URL}/api/images/${article.featured_image}`;
    const imageAlt = article.image_alt || `Featured image for ${article.title}`;
    imageYaml = `image:
  src: "${imageUrl}"
  alt: "${escapeYaml(imageAlt)}"`;
  }

  // Extract tags from title/content
  const words = article.title.toLowerCase().split(/\s+/);
  const commonTags = ["ai", "machine-learning", "tools", "guide", "tutorial", "business"];
  const tags = words.filter(w => w.length > 3 && !["the", "and", "for", "how", "what", "best", "with", "your", "from"].includes(w)).slice(0, 4);

  return `---
title: "${escapeYaml(article.title)}"
description: "${escapeYaml(article.meta_description || "")}"
category: "${article.category}"
author:
  name: "GrowthGear Team"
publishedAt: ${publishedDate}
${imageYaml}
tags:
${tags.map(t => `  - ${t}`).join("\n")}
${article.is_sponsored ? "isSponsored: true" : ""}
---`.replace(/\n\n+/g, "\n").trim();
}

function getArticlesDir(siteId: string): string {
  return path.join(process.cwd(), "sites", siteId, "src", "content", "articles");
}

function articleExists(siteId: string, slug: string): boolean {
  const articlesDir = getArticlesDir(siteId);
  const filePath = path.join(articlesDir, `${slug}.md`);
  return fs.existsSync(filePath);
}

function createArticle(article: Article): boolean {
  if (articleExists(article.site_id, article.slug)) {
    console.log(`  Skip: ${article.slug} (exists)`);
    return false;
  }

  if (!article.content) {
    console.log(`  Skip: ${article.slug} (no content)`);
    return false;
  }

  const articlesDir = getArticlesDir(article.site_id);

  // Check if site directory exists
  if (!fs.existsSync(articlesDir)) {
    console.log(`  Skip: ${article.slug} (site ${article.site_id} dir missing)`);
    return false;
  }

  // Remove the title heading if it's at the start of content (avoid duplication)
  let content = article.content;
  const titlePattern = /^#\s+.+\n+/;
  if (titlePattern.test(content)) {
    content = content.replace(titlePattern, "");
  }

  const frontmatter = generateFrontmatter(article);
  const markdown = `${frontmatter}\n\n${content.trim()}\n`;

  const filePath = path.join(articlesDir, `${article.slug}.md`);
  fs.writeFileSync(filePath, markdown, "utf-8");
  console.log(`  Created: ${article.slug}`);
  return true;
}

async function main() {
  const jsonPath = process.argv[2] || "/tmp/articles_full.json";

  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
  }

  console.log(`Reading articles from ${jsonPath}...`);
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as WranglerOutput[];

  // Wrangler returns an array with one element containing results
  const articles = data[0]?.results || [];
  console.log(`Found ${articles.length} articles\n`);

  // Group by site
  const bySite = articles.reduce((acc, article) => {
    if (!acc[article.site_id]) acc[article.site_id] = [];
    acc[article.site_id].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  let created = 0;
  let skipped = 0;

  for (const [siteId, siteArticles] of Object.entries(bySite)) {
    console.log(`\n${siteId.toUpperCase()} (${siteArticles.length} articles):`);

    for (const article of siteArticles) {
      if (createArticle(article)) {
        created++;
      } else {
        skipped++;
      }
    }
  }

  console.log(`\n✓ Done: ${created} created, ${skipped} skipped`);
}

main().catch(console.error);
