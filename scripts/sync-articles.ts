#!/usr/bin/env npx tsx
/**
 * Article Sync Script
 *
 * Fetches published articles from the API and writes them as markdown files
 * to the appropriate site's content/articles directory.
 *
 * Usage:
 *   npx tsx scripts/sync-articles.ts
 *   npx tsx scripts/sync-articles.ts --site ai
 *   npx tsx scripts/sync-articles.ts --api-key YOUR_KEY
 *
 * Environment variables:
 *   ADMIN_API_KEY - API key for authentication
 *   API_URL - API base URL (default: https://growthgear-api.andrew-705.workers.dev)
 */

import * as fs from "fs";
import * as path from "path";

const API_URL = process.env.API_URL || "https://growthgear-api.andrew-705.workers.dev";

// Category mappings for each site
// Maps AI-generated categories to valid site categories
const CATEGORY_MAPPINGS: Record<string, Record<string, string>> = {
  ai: {
    "artificial-intelligence": "machine-learning",
    "ai": "ai-tools",
    "machine-learning": "machine-learning",
    "ml": "machine-learning",
    "deep-learning": "deep-learning",
    "neural-networks": "deep-learning",
    "ai-tools": "ai-tools",
    "tools": "ai-tools",
    "nlp": "machine-learning",
    "natural-language-processing": "machine-learning",
  },
  sales: {
    "sales-techniques": "sales-techniques",
    "b2b-sales": "b2b-sales",
    "crm-tools": "crm-tools",
    "lead-generation": "sales-techniques",
    "sales": "sales-techniques",
    "crm": "crm-tools",
    "tools": "crm-tools",
  },
  marketing: {
    "content-marketing": "content-marketing",
    "seo": "seo",
    "social-media": "social-media",
    "digital-marketing": "content-marketing",
    "content-strategy": "content-marketing",
    "analytics": "seo",
    "email-marketing": "content-marketing",
  },
};

// Default categories per site (fallback)
const DEFAULT_CATEGORIES: Record<string, string> = {
  ai: "machine-learning",
  sales: "sales-techniques",
  marketing: "content-marketing",
};

interface Article {
  id: number;
  site_id: string;
  slug: string;
  title: string;
  meta_description: string;
  primary_keyword: string;
  category: string | null;
  content: string;
  word_count: number;
  featured_image: string | null;
  image_alt: string | null;
  published_at: string;
  is_sponsored: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

function parseArgs(): { siteId?: string; apiKey?: string } {
  const args = process.argv.slice(2);
  const result: { siteId?: string; apiKey?: string } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--site" && args[i + 1]) {
      result.siteId = args[i + 1];
      i++;
    } else if (args[i] === "--api-key" && args[i + 1]) {
      result.apiKey = args[i + 1];
      i++;
    }
  }

  return result;
}

function mapCategory(siteId: string, category: string | null): string {
  if (!category) {
    return DEFAULT_CATEGORIES[siteId] || "general";
  }

  const normalizedCategory = category.toLowerCase().trim();
  const mappings = CATEGORY_MAPPINGS[siteId] || {};

  return mappings[normalizedCategory] || DEFAULT_CATEGORIES[siteId] || normalizedCategory;
}

function extractFaqFromContent(content: string): { faq: FAQ[]; cleanContent: string } {
  // Try to extract FAQ section from content
  const faqPattern = /## (?:FAQ|Frequently Asked Questions)[\s\S]*$/i;
  const faqMatch = content.match(faqPattern);

  if (!faqMatch) {
    return { faq: [], cleanContent: content };
  }

  const faqSection = faqMatch[0];
  const cleanContent = content.replace(faqPattern, "").trim();

  // Parse FAQ items (format: ### Question\nAnswer)
  const faq: FAQ[] = [];
  const questionPattern = /###\s*(.+?)\n([\s\S]*?)(?=###|$)/g;
  let match;

  while ((match = questionPattern.exec(faqSection)) !== null) {
    const question = match[1].trim().replace(/\?$/, "") + "?";
    const answer = match[2].trim();
    if (question && answer) {
      faq.push({ question, answer });
    }
  }

  return { faq, cleanContent };
}

function generateFrontmatter(article: Article, faq: FAQ[]): string {
  const category = mapCategory(article.site_id, article.category);
  const publishedDate = new Date(article.published_at).toISOString().split("T")[0];

  // Build image object if we have a featured image
  let imageYaml = "";
  if (article.featured_image) {
    const imageUrl = article.featured_image.startsWith("http")
      ? article.featured_image
      : `${API_URL}/api/images/${article.featured_image}`;
    const imageAlt = article.image_alt || `Featured image for ${article.title}`;
    imageYaml = `image:
  src: "${imageUrl}"
  alt: "${imageAlt.replace(/"/g, '\\"')}"`;
  }

  // Build tags from primary keyword
  const tags = article.primary_keyword
    ? article.primary_keyword.split(/[,\s]+/).filter(t => t.length > 2).slice(0, 5)
    : [];

  // Build FAQ YAML
  let faqYaml = "";
  if (faq.length > 0) {
    faqYaml = `faq:
${faq.map(f => `  - question: "${f.question.replace(/"/g, '\\"')}"
    answer: "${f.answer.replace(/"/g, '\\"').replace(/\n/g, " ")}"`).join("\n")}`;
  }

  return `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${(article.meta_description || "").replace(/"/g, '\\"')}"
category: "${category}"
author:
  name: "AI Insights Team"
publishedAt: ${publishedDate}
${imageYaml}
${tags.length > 0 ? `tags:
${tags.map(t => `  - ${t}`).join("\n")}` : ""}
${article.is_sponsored ? "isSponsored: true" : ""}
${faqYaml}
---`.replace(/\n\n+/g, "\n");
}

async function fetchArticles(apiKey: string, siteId?: string): Promise<Article[]> {
  const url = new URL(`${API_URL}/api/articles`);
  url.searchParams.set("status", "published");
  url.searchParams.set("limit", "100");
  if (siteId) {
    url.searchParams.set("site_id", siteId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { success: boolean; data: Article[]; error?: string };

  if (!data.success) {
    throw new Error(`API error: ${data.error}`);
  }

  return data.data;
}

async function fetchFullArticle(apiKey: string, id: number): Promise<Article> {
  const response = await fetch(`${API_URL}/api/articles/${id}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article ${id}: ${response.status}`);
  }

  const data = await response.json() as { success: boolean; data: Article };
  return data.data;
}

function getArticlesDir(siteId: string): string {
  const sitePath = path.join(process.cwd(), "sites", siteId, "src", "content", "articles");
  return sitePath;
}

function articleExists(siteId: string, slug: string): boolean {
  const articlesDir = getArticlesDir(siteId);
  const filePath = path.join(articlesDir, `${slug}.md`);
  return fs.existsSync(filePath);
}

async function syncArticle(apiKey: string, article: Article): Promise<boolean> {
  // Check if article already exists
  if (articleExists(article.site_id, article.slug)) {
    console.log(`  Skipping ${article.slug} (already exists)`);
    return false;
  }

  // Fetch full article content
  const fullArticle = await fetchFullArticle(apiKey, article.id);

  if (!fullArticle.content) {
    console.log(`  Skipping ${article.slug} (no content)`);
    return false;
  }

  // Extract FAQ from content if embedded
  const { faq, cleanContent } = extractFaqFromContent(fullArticle.content);

  // Generate frontmatter
  const frontmatter = generateFrontmatter(fullArticle, faq);

  // Combine frontmatter and content
  const markdown = `${frontmatter}\n\n${cleanContent}`;

  // Ensure directory exists
  const articlesDir = getArticlesDir(article.site_id);
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  // Write file
  const filePath = path.join(articlesDir, `${article.slug}.md`);
  fs.writeFileSync(filePath, markdown, "utf-8");

  console.log(`  Synced: ${article.slug}`);
  return true;
}

async function main() {
  const { siteId, apiKey: argApiKey } = parseArgs();
  const apiKey = argApiKey || process.env.ADMIN_API_KEY;

  if (!apiKey) {
    console.error("Error: API key required. Set ADMIN_API_KEY env var or use --api-key");
    process.exit(1);
  }

  console.log("Fetching published articles...");
  const articles = await fetchArticles(apiKey, siteId);
  console.log(`Found ${articles.length} published articles`);

  if (articles.length === 0) {
    console.log("No articles to sync");
    return;
  }

  // Group by site
  const bySite = articles.reduce((acc, article) => {
    if (!acc[article.site_id]) {
      acc[article.site_id] = [];
    }
    acc[article.site_id].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  let synced = 0;
  let skipped = 0;

  for (const [site, siteArticles] of Object.entries(bySite)) {
    console.log(`\nProcessing site: ${site} (${siteArticles.length} articles)`);

    for (const article of siteArticles) {
      try {
        const wasSync = await syncArticle(apiKey, article);
        if (wasSync) synced++;
        else skipped++;
      } catch (error) {
        console.error(`  Error syncing ${article.slug}:`, error);
        skipped++;
      }
    }
  }

  console.log(`\nSync complete: ${synced} synced, ${skipped} skipped`);
}

main().catch(console.error);
