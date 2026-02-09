#!/usr/bin/env node
/**
 * Creates markdown files from the database export JSON
 * Usage: node scripts/create-markdown-from-db.mjs /path/to/articles.json
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const API_URL = "https://growthgear-api.growthgear.workers.dev";

function escapeYaml(str) {
  if (!str) return "";
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function generateFrontmatter(article) {
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

  const words = article.title.toLowerCase().split(/\s+/);
  const stopWords = ["the", "and", "for", "how", "what", "best", "with", "your", "from", "that", "this", "guide", "2024", "complete"];
  const tags = words
    .map(w => w.replace(/[^a-z0-9-]/g, "")) // Remove special chars
    .filter(w => w.length > 3 && !stopWords.includes(w))
    .slice(0, 4);

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

function getArticlesDir(siteId) {
  return path.join(projectRoot, "sites", siteId, "src", "content", "articles");
}

function articleExists(siteId, slug) {
  const articlesDir = getArticlesDir(siteId);
  const filePath = path.join(articlesDir, `${slug}.md`);
  return fs.existsSync(filePath);
}

function createArticle(article) {
  if (articleExists(article.site_id, article.slug)) {
    console.log(`  Skip: ${article.slug} (exists)`);
    return false;
  }

  if (!article.content) {
    console.log(`  Skip: ${article.slug} (no content)`);
    return false;
  }

  const articlesDir = getArticlesDir(article.site_id);

  if (!fs.existsSync(articlesDir)) {
    console.log(`  Skip: ${article.slug} (site ${article.site_id} dir missing)`);
    return false;
  }

  // Remove title heading if at start
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
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const articles = data[0]?.results || [];
  console.log(`Found ${articles.length} articles\n`);

  const bySite = articles.reduce((acc, article) => {
    if (!acc[article.site_id]) acc[article.site_id] = [];
    acc[article.site_id].push(article);
    return acc;
  }, {});

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
