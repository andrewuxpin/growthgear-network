import { ContentGenerator } from "@growthgear/content-engine";
import type { ArticleRequest, GeneratedArticle } from "@growthgear/content-engine";

export interface Env {
  DB: D1Database;
  AI: Ai;
  IMAGES: R2Bucket;
  ANTHROPIC_API_KEY: string;
  ADMIN_API_KEY: string;
  GITHUB_TOKEN: string;
  ENVIRONMENT: string;
}

interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

function json<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function unauthorized(): Response {
  return json({ success: false, error: "Unauthorized" }, 401);
}

function checkAuth(request: Request, env: Env): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return token === env.ADMIN_API_KEY;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    try {
      // Health check
      if (path === "/health") {
        return json({ success: true, data: { status: "ok" } });
      }

      // Public endpoint for fetching published articles (for static site generation)
      if (path === "/api/public/articles" && request.method === "GET") {
        return await getPublicArticles(url, env);
      }

      // Public endpoint for images (no auth required)
      if (path.startsWith("/api/images/") && request.method === "GET") {
        const key = path.replace("/api/images/", "");
        return await getImage(key, env);
      }

      // Public tracking endpoint (no auth, lightweight)
      if (path === "/api/track" && request.method === "POST") {
        return await trackPageView(request, env);
      }

      // Public contact form endpoint (no auth required)
      if (path === "/api/public/contact" && request.method === "POST") {
        return await handleContactSubmission(request, env);
      }

      // All other endpoints require auth
      if (!checkAuth(request, env)) {
        return unauthorized();
      }

      // Sites
      if (path === "/api/sites" && request.method === "GET") {
        return await getSites(env);
      }
      if (path === "/api/sites" && request.method === "POST") {
        return await createSite(request, env);
      }

      // Keywords
      if (path === "/api/keywords" && request.method === "GET") {
        return await getKeywords(url, env);
      }
      if (path === "/api/keywords" && request.method === "POST") {
        return await createKeyword(request, env);
      }
      if (path.startsWith("/api/keywords/") && request.method === "PUT") {
        const id = path.split("/")[3];
        return await updateKeyword(id, request, env);
      }

      // Articles
      if (path === "/api/articles" && request.method === "GET") {
        return await getArticles(url, env);
      }
      if (path.startsWith("/api/articles/") && request.method === "GET") {
        const id = path.split("/")[3];
        return await getArticle(id, env);
      }
      if (path === "/api/articles" && request.method === "POST") {
        return await createArticle(request, env);
      }
      if (path.startsWith("/api/articles/") && path.endsWith("/republish") && request.method === "POST") {
        const id = path.split("/")[3];
        return await republishArticle(id, env);
      }
      if (path.startsWith("/api/articles/") && request.method === "PUT") {
        const id = path.split("/")[3];
        return await updateArticle(id, request, env);
      }

      // Content Generation
      if (path === "/api/generate" && request.method === "POST") {
        return await generateContent(request, env);
      }

      // Image Generation
      if (path === "/api/generate-image" && request.method === "POST") {
        return await generateImage(request, env);
      }

      // Stats
      if (path === "/api/stats" && request.method === "GET") {
        return await getStats(env);
      }

      // Sync keywords with existing articles
      if (path === "/api/keywords/sync" && request.method === "POST") {
        return await syncKeywords(env);
      }

      // Analytics
      if (path === "/api/analytics/overview" && request.method === "GET") {
        return await getAnalyticsOverview(url, env);
      }
      if (path === "/api/analytics/sites" && request.method === "GET") {
        return await getAnalyticsBySite(url, env);
      }
      if (path === "/api/analytics/pages" && request.method === "GET") {
        return await getAnalyticsByPage(url, env);
      }
      if (path === "/api/analytics/referrers" && request.method === "GET") {
        return await getAnalyticsReferrers(url, env);
      }

      return json({ success: false, error: "Not found" }, 404);
    } catch (error) {
      console.error("API Error:", error);
      return json(
        { success: false, error: error instanceof Error ? error.message : "Internal error" },
        500
      );
    }
  },
};

// === Sites ===
async function getSites(env: Env): Promise<Response> {
  const result = await env.DB.prepare("SELECT * FROM sites ORDER BY created_at DESC").all();
  return json({ success: true, data: result.results });
}

async function createSite(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { id: string; name: string; niche: string; domain?: string };
  await env.DB.prepare(
    "INSERT INTO sites (id, name, niche, domain) VALUES (?, ?, ?, ?)"
  )
    .bind(body.id, body.name, body.niche, body.domain || null)
    .run();
  return json({ success: true, data: { id: body.id } }, 201);
}

// === Keywords ===
async function getKeywords(url: URL, env: Env): Promise<Response> {
  const siteId = url.searchParams.get("site_id");
  const status = url.searchParams.get("status");

  let query = "SELECT * FROM keywords WHERE 1=1";
  const params: (string | null)[] = [];

  if (siteId) {
    query += " AND site_id = ?";
    params.push(siteId);
  }
  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  query += " ORDER BY created_at DESC LIMIT 100";

  const stmt = env.DB.prepare(query);
  const result = await (params.length ? stmt.bind(...params) : stmt).all();
  return json({ success: true, data: result.results });
}

async function createKeyword(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as {
    site_id: string;
    keyword: string;
    search_volume?: number;
    difficulty?: number;
  };
  const result = await env.DB.prepare(
    "INSERT INTO keywords (site_id, keyword, search_volume, difficulty) VALUES (?, ?, ?, ?) RETURNING id"
  )
    .bind(body.site_id, body.keyword, body.search_volume || null, body.difficulty || null)
    .first<{ id: number }>();
  return json({ success: true, data: { id: result?.id } }, 201);
}

async function updateKeyword(id: string, request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { status?: string; assigned_article_id?: number };
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (body.status) {
    updates.push("status = ?");
    params.push(body.status);
  }
  if (body.assigned_article_id !== undefined) {
    updates.push("assigned_article_id = ?");
    params.push(body.assigned_article_id);
  }

  if (updates.length === 0) {
    return json({ success: false, error: "No updates provided" }, 400);
  }

  params.push(id);
  await env.DB.prepare(`UPDATE keywords SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
  return json({ success: true });
}

// === Articles ===
async function getArticles(url: URL, env: Env): Promise<Response> {
  const siteId = url.searchParams.get("site_id");
  const status = url.searchParams.get("status");
  const limit = parseInt(url.searchParams.get("limit") || "50");

  let query = "SELECT id, site_id, slug, title, meta_description, primary_keyword, category, word_count, featured_image, image_alt, status, published_at, refreshed_at, is_sponsored FROM articles WHERE 1=1";
  const params: (string | number)[] = [];

  if (siteId) {
    query += " AND site_id = ?";
    params.push(siteId);
  }
  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  query += " ORDER BY created_at DESC LIMIT ?";
  params.push(limit);

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();
  return json({ success: true, data: result.results });
}

async function getArticle(id: string, env: Env): Promise<Response> {
  const result = await env.DB.prepare("SELECT * FROM articles WHERE id = ?")
    .bind(id)
    .first();
  if (!result) {
    return json({ success: false, error: "Article not found" }, 404);
  }
  return json({ success: true, data: result });
}

async function createArticle(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as {
    site_id: string;
    slug: string;
    title: string;
    meta_description?: string;
    primary_keyword?: string;
    content?: string;
    word_count?: number;
    status?: string;
  };

  const result = await env.DB.prepare(
    `INSERT INTO articles (site_id, slug, title, meta_description, primary_keyword, content, word_count, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id`
  )
    .bind(
      body.site_id,
      body.slug,
      body.title,
      body.meta_description || null,
      body.primary_keyword || null,
      body.content || null,
      body.word_count || null,
      body.status || "draft"
    )
    .first<{ id: number }>();

  return json({ success: true, data: { id: result?.id } }, 201);
}

async function updateArticle(id: string, request: Request, env: Env): Promise<Response> {
  const body = await request.json() as Record<string, unknown>;
  const allowedFields = [
    "title", "meta_description", "content", "word_count", "status", "published_at",
    "slug", "category", "featured_image", "image_alt", "primary_keyword"
  ];
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(body[field] as string | number | null);
    }
  }

  // Always update refreshed_at when article is edited
  updates.push("refreshed_at = ?");
  params.push(new Date().toISOString());

  if (updates.length === 1) { // Only refreshed_at, no actual updates
    return json({ success: false, error: "No updates provided" }, 400);
  }

  params.push(id);
  await env.DB.prepare(`UPDATE articles SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
  return json({ success: true });
}

// === Single Article Republish ===
const GITHUB_REPO = "andrewuxpin/growthgear-network";
const GITHUB_API = "https://api.github.com";

// Category mappings for markdown generation
const CATEGORY_MAPPINGS: Record<string, Record<string, string>> = {
  ai: {
    "artificial-intelligence": "machine-learning",
    "ai": "ai-tools",
    "machine-learning": "machine-learning",
    "deep-learning": "deep-learning",
    "ai-tools": "ai-tools",
  },
  sales: {
    "sales-techniques": "sales-techniques",
    "b2b-sales": "b2b-sales",
    "crm-tools": "crm-tools",
    "sales": "sales-techniques",
  },
  marketing: {
    "content-marketing": "content-marketing",
    "seo": "seo",
    "social-media": "social-media",
  },
};

const DEFAULT_CATEGORIES: Record<string, string> = {
  ai: "machine-learning",
  sales: "sales-techniques",
  marketing: "content-marketing",
};

function mapCategory(siteId: string, category: string | null): string {
  if (!category) return DEFAULT_CATEGORIES[siteId] || "general";
  const normalized = category.toLowerCase().trim();
  const mappings = CATEGORY_MAPPINGS[siteId] || {};
  return mappings[normalized] || DEFAULT_CATEGORIES[siteId] || normalized;
}

interface ArticleData {
  id: number;
  site_id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  primary_keyword: string | null;
  category: string | null;
  content: string | null;
  featured_image: string | null;
  image_alt: string | null;
  published_at: string | null;
  is_sponsored: boolean;
}

function generateMarkdown(article: ArticleData, apiUrl: string): string {
  const category = mapCategory(article.site_id, article.category);
  const publishedDate = article.published_at
    ? new Date(article.published_at).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  // Build image YAML
  let imageYaml = "";
  if (article.featured_image) {
    const imageUrl = article.featured_image.startsWith("http")
      ? article.featured_image
      : `${apiUrl}/api/images/${article.featured_image}`;
    const imageAlt = article.image_alt || `Featured image for ${article.title}`;
    imageYaml = `image:
  src: "${imageUrl}"
  alt: "${imageAlt.replace(/"/g, '\\"')}"`;
  }

  // Build tags from keyword
  const tags = article.primary_keyword
    ? article.primary_keyword.split(/[,\s]+/).filter((t: string) => t.length > 2).slice(0, 5)
    : [];

  const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${(article.meta_description || "").replace(/"/g, '\\"')}"
category: "${category}"
author:
  name: "GrowthGear Team"
publishedAt: ${publishedDate}
${imageYaml}
${tags.length > 0 ? `tags:
${tags.map((t: string) => `  - ${t}`).join("\n")}` : ""}
${article.is_sponsored ? "isSponsored: true" : ""}
---`.replace(/\n\n+/g, "\n");

  return `${frontmatter}\n\n${article.content || ""}`;
}

async function republishArticle(id: string, env: Env): Promise<Response> {
  // Check if GitHub token is configured
  if (!env.GITHUB_TOKEN) {
    return json({ success: false, error: "GitHub token not configured. Add GITHUB_TOKEN secret to worker." }, 500);
  }

  // Fetch the article
  const article = await env.DB.prepare("SELECT * FROM articles WHERE id = ?")
    .bind(id)
    .first<ArticleData>();

  if (!article) {
    return json({ success: false, error: "Article not found" }, 404);
  }

  if (article.status !== "published") {
    return json({ success: false, error: "Article must be published before republishing" }, 400);
  }

  if (!article.content) {
    return json({ success: false, error: "Article has no content" }, 400);
  }

  const apiUrl = "https://growthgear-api.growthgear.workers.dev";
  const markdown = generateMarkdown(article, apiUrl);
  const filePath = `sites/${article.site_id}/src/content/articles/${article.slug}.md`;

  try {
    // Step 1: Check if file exists and get its SHA
    let fileSha: string | null = null;
    const getFileResponse = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/contents/${filePath}`, {
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "GrowthGear-API",
      },
    });

    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json() as { sha: string };
      fileSha = fileData.sha;
    }

    // Step 2: Create or update the file
    const commitMessage = `Update article: ${article.title}`;
    const contentBase64 = btoa(unescape(encodeURIComponent(markdown)));

    const updatePayload: Record<string, unknown> = {
      message: commitMessage,
      content: contentBase64,
      branch: "main",
    };

    if (fileSha) {
      updatePayload.sha = fileSha;
    }

    const updateResponse = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "GrowthGear-API",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      console.error("GitHub file update failed:", errorData);
      return json({ success: false, error: `Failed to commit file: ${updateResponse.status}` }, 500);
    }

    const commitData = await updateResponse.json() as { commit: { sha: string; html_url: string } };

    // Step 3: Trigger the deploy workflow for just this site
    const workflowResponse = await fetch(
      `${GITHUB_API}/repos/${GITHUB_REPO}/actions/workflows/deploy-sites.yml/dispatches`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "GrowthGear-API",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: "main",
          inputs: {
            site: article.site_id,
          },
        }),
      }
    );

    if (!workflowResponse.ok) {
      const errorData = await workflowResponse.text();
      console.error("GitHub workflow trigger failed:", errorData);
      // File was committed, just workflow failed
      return json({
        success: true,
        data: {
          committed: true,
          deployed: false,
          commitSha: commitData.commit.sha,
          commitUrl: commitData.commit.html_url,
          message: "Article committed but deploy workflow failed to trigger. You may need to trigger it manually.",
        },
      });
    }

    // Update refreshed_at timestamp
    await env.DB.prepare("UPDATE articles SET refreshed_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), id)
      .run();

    return json({
      success: true,
      data: {
        committed: true,
        deployed: true,
        site: article.site_id,
        commitSha: commitData.commit.sha,
        commitUrl: commitData.commit.html_url,
        message: `Article "${article.title}" republished to ${article.site_id} site. Deploy in progress.`,
      },
    });
  } catch (error) {
    console.error("Republish error:", error);
    return json(
      { success: false, error: error instanceof Error ? error.message : "Republish failed" },
      500
    );
  }
}

// === Content Generation ===
async function generateContent(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as ArticleRequest & { keywordId?: number };

  // Validate required fields
  if (!body.keyword || !body.siteId || !body.niche) {
    return json({ success: false, error: "Missing required fields: keyword, siteId, niche" }, 400);
  }

  // Get existing articles for internal linking
  const existingArticles = await env.DB.prepare(
    "SELECT slug, title FROM articles WHERE site_id = ? AND status = 'published' LIMIT 20"
  )
    .bind(body.siteId)
    .all<{ slug: string; title: string }>();

  const generator = new ContentGenerator({ apiKey: env.ANTHROPIC_API_KEY });

  const article = await generator.generateArticle({
    ...body,
    existingArticles: existingArticles.results,
  });

  // Save to database
  const result = await env.DB.prepare(
    `INSERT INTO articles (site_id, slug, title, meta_description, primary_keyword, category, content, word_count, image_alt, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
     RETURNING id`
  )
    .bind(
      body.siteId,
      article.slug,
      article.title,
      article.metaDescription,
      body.keyword,
      article.category || null,
      article.content,
      article.wordCount,
      article.imageAltText || null
    )
    .first<{ id: number }>();

  // Update keyword status if keywordId provided, or find by keyword string
  if (body.keywordId) {
    await env.DB.prepare(
      "UPDATE keywords SET status = 'completed', assigned_article_id = ? WHERE id = ?"
    ).bind(result?.id, body.keywordId).run();
  } else {
    // Try to find and update keyword by keyword string (case-insensitive)
    await env.DB.prepare(
      "UPDATE keywords SET status = 'completed', assigned_article_id = ? WHERE site_id = ? AND LOWER(keyword) = LOWER(?) AND status IN ('queued', 'processing')"
    ).bind(result?.id, body.siteId, body.keyword).run();
  }

  return json({
    success: true,
    data: {
      id: result?.id,
      article,
    },
  });
}

// === Stats ===
async function getStats(env: Env): Promise<Response> {
  const [sites, articles, keywords] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as count FROM sites").first<{ count: number }>(),
    env.DB.prepare(
      "SELECT status, COUNT(*) as count FROM articles GROUP BY status"
    ).all<{ status: string; count: number }>(),
    env.DB.prepare(
      "SELECT status, COUNT(*) as count FROM keywords GROUP BY status"
    ).all<{ status: string; count: number }>(),
  ]);

  return json({
    success: true,
    data: {
      totalSites: sites?.count || 0,
      articles: articles.results.reduce((acc, row) => ({ ...acc, [row.status]: row.count }), {}),
      keywords: keywords.results.reduce((acc, row) => ({ ...acc, [row.status]: row.count }), {}),
    },
  });
}

// === Keyword Sync ===
async function syncKeywords(env: Env): Promise<Response> {
  // Find keywords that have matching published articles but are still queued
  const result = await env.DB.prepare(`
    UPDATE keywords
    SET status = 'completed',
        assigned_article_id = (
          SELECT a.id FROM articles a
          WHERE a.site_id = keywords.site_id
          AND LOWER(a.primary_keyword) = LOWER(keywords.keyword)
          LIMIT 1
        )
    WHERE status IN ('queued', 'processing')
    AND EXISTS (
      SELECT 1 FROM articles a
      WHERE a.site_id = keywords.site_id
      AND LOWER(a.primary_keyword) = LOWER(keywords.keyword)
    )
  `).run();

  return json({
    success: true,
    data: {
      message: "Keywords synced with existing articles",
      updated: result.meta.changes,
    },
  });
}

// === Public API (no auth required) ===
async function getPublicArticles(url: URL, env: Env): Promise<Response> {
  const siteId = url.searchParams.get("site_id");

  if (!siteId) {
    return json({ success: false, error: "site_id is required" }, 400);
  }

  const articles = await env.DB.prepare(
    `SELECT id, slug, title, meta_description, primary_keyword, content, word_count, featured_image, published_at
     FROM articles
     WHERE site_id = ? AND status = 'published'
     ORDER BY published_at DESC`
  )
    .bind(siteId)
    .all();

  return json({ success: true, data: articles.results });
}

// === Contact Form ===
async function handleContactSubmission(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as {
    site_id?: string;
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!body.site_id || !body.name || !body.email || !body.subject || !body.message) {
    return json({ success: false, error: "All fields are required: site_id, name, email, subject, message" }, 400);
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return json({ success: false, error: "Invalid email address" }, 400);
  }

  await env.DB.prepare(
    "INSERT INTO contact_submissions (site_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(body.site_id, body.name, body.email, body.subject, body.message)
    .run();

  return json({ success: true, data: { message: "Your message has been sent successfully." } }, 201);
}

// === Image Generation ===
async function generateImage(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { prompt: string; articleId?: number };

  if (!body.prompt) {
    return json({ success: false, error: "Missing required field: prompt" }, 400);
  }

  try {
    // Enhance prompt for better results
    const enhancedPrompt = `${body.prompt}, photorealistic, professional photography, sharp focus, cinematic lighting, 4k quality`;

    // Generate image using FLUX (fast and high quality)
    const response = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
      prompt: enhancedPrompt,
      num_steps: 4,
    });

    // Convert response to ArrayBuffer for R2 storage
    let imageData: ArrayBuffer;
    if (response instanceof ArrayBuffer) {
      imageData = response;
    } else if (response instanceof Uint8Array) {
      imageData = response.buffer.slice(response.byteOffset, response.byteOffset + response.byteLength);
    } else if (typeof response === 'object' && response !== null && 'image' in response) {
      // Some models return { image: base64string }
      const base64 = (response as { image: string }).image;
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      imageData = bytes.buffer;
    } else {
      // Try to use response directly as bytes
      imageData = new Uint8Array(response as number[]).buffer;
    }

    // Generate unique filename
    const timestamp = Date.now();
    const slug = body.prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
    const filename = `${timestamp}-${slug}.png`;

    // Store in R2
    await env.IMAGES.put(filename, imageData, {
      httpMetadata: {
        contentType: "image/png",
      },
      customMetadata: {
        prompt: body.prompt,
        articleId: body.articleId?.toString() || "",
      },
    });

    // If article ID provided, update the article with the image URL
    if (body.articleId) {
      await env.DB.prepare(
        "UPDATE articles SET featured_image = ? WHERE id = ?"
      ).bind(filename, body.articleId).run();
    }

    return json({
      success: true,
      data: {
        filename,
        url: `/api/images/${filename}`,
        prompt: body.prompt,
      },
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return json(
      { success: false, error: error instanceof Error ? error.message : "Image generation failed" },
      500
    );
  }
}

async function getImage(key: string, env: Env): Promise<Response> {
  const object = await env.IMAGES.get(key);

  if (!object) {
    return new Response("Image not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType || "image/png");
  headers.set("Cache-Control", "public, max-age=31536000");
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(object.body, { headers });
}

// === Analytics Tracking ===
const BOT_PATTERNS = [
  "bot", "crawler", "spider", "scraper", "curl", "wget", "python", "java",
  "headless", "phantom", "selenium", "puppeteer", "playwright"
];

const VALID_PATH_PATTERN = /^\/([a-z0-9-]+\/?)*$/;

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(pattern => ua.includes(pattern)) || !userAgent;
}

function isValidPath(path: string): boolean {
  // Must start with /, only allow alphanumeric, hyphens, and slashes
  // Reject paths that look like brand probing (single word paths that aren't known)
  if (!VALID_PATH_PATTERN.test(path)) return false;

  // Allow known valid paths
  const knownPaths = ["/", "/about/", "/contact/", "/privacy/", "/terms/"];
  const knownPrefixes = ["/machine-learning/", "/ai-tools/", "/deep-learning/",
    "/b2b-sales/", "/sales-techniques/", "/crm-tools/",
    "/content-marketing/", "/seo/", "/social-media/"];

  if (knownPaths.includes(path)) return true;
  if (knownPrefixes.some(p => path.startsWith(p))) return true;

  // Reject single-segment paths that aren't categories (likely probing)
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 1 && !knownPaths.includes("/" + segments[0] + "/")) {
    return false;
  }

  return true;
}

async function trackPageView(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { site_id: string; path: string; referrer?: string };

    if (!body.site_id || !body.path) {
      return json({ success: false, error: "site_id and path required" }, 400);
    }

    // Get country from Cloudflare headers
    const country = request.headers.get("cf-ipcountry") || "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    // Don't track bots
    if (isBot(userAgent)) {
      return json({ success: true, data: { tracked: false, reason: "bot" } });
    }

    // Don't track suspicious paths (likely probing/scanning)
    if (!isValidPath(body.path)) {
      return json({ success: true, data: { tracked: false, reason: "invalid_path" } });
    }

    await env.DB.prepare(
      "INSERT INTO page_views (site_id, path, referrer, user_agent, country) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(body.site_id, body.path, body.referrer || null, userAgent.slice(0, 255), country)
      .run();

    return json({ success: true, data: { tracked: true } });
  } catch (error) {
    console.error("Tracking error:", error);
    // Don't fail the request if tracking fails
    return json({ success: true, data: { tracked: false, reason: "error" } });
  }
}

// === Analytics Queries ===
async function getAnalyticsOverview(url: URL, env: Env): Promise<Response> {
  const days = parseInt(url.searchParams.get("days") || "30");
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const [totalViews, viewsByDay, topSites, topPages] = await Promise.all([
    // Total views
    env.DB.prepare(
      "SELECT COUNT(*) as total FROM page_views WHERE created_at >= ?"
    ).bind(dateLimit.toISOString()).first<{ total: number }>(),

    // Views by day
    env.DB.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as views
      FROM page_views
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `).bind(dateLimit.toISOString()).all<{ date: string; views: number }>(),

    // Top sites
    env.DB.prepare(`
      SELECT site_id, COUNT(*) as views
      FROM page_views
      WHERE created_at >= ?
      GROUP BY site_id
      ORDER BY views DESC
    `).bind(dateLimit.toISOString()).all<{ site_id: string; views: number }>(),

    // Top pages
    env.DB.prepare(`
      SELECT site_id, path, COUNT(*) as views
      FROM page_views
      WHERE created_at >= ?
      GROUP BY site_id, path
      ORDER BY views DESC
      LIMIT 20
    `).bind(dateLimit.toISOString()).all<{ site_id: string; path: string; views: number }>(),
  ]);

  return json({
    success: true,
    data: {
      period: { days, from: dateLimit.toISOString() },
      totalViews: totalViews?.total || 0,
      viewsByDay: viewsByDay.results,
      topSites: topSites.results,
      topPages: topPages.results,
    },
  });
}

async function getAnalyticsBySite(url: URL, env: Env): Promise<Response> {
  const siteId = url.searchParams.get("site_id");
  const days = parseInt(url.searchParams.get("days") || "30");
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  let query = `
    SELECT site_id, COUNT(*) as views,
           COUNT(DISTINCT DATE(created_at)) as active_days
    FROM page_views
    WHERE created_at >= ?
  `;
  const params: string[] = [dateLimit.toISOString()];

  if (siteId) {
    query += " AND site_id = ?";
    params.push(siteId);
  }

  query += " GROUP BY site_id ORDER BY views DESC";

  const result = await env.DB.prepare(query).bind(...params).all();

  return json({ success: true, data: result.results });
}

async function getAnalyticsByPage(url: URL, env: Env): Promise<Response> {
  const siteId = url.searchParams.get("site_id");
  const days = parseInt(url.searchParams.get("days") || "30");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  if (!siteId) {
    return json({ success: false, error: "site_id required" }, 400);
  }

  const result = await env.DB.prepare(`
    SELECT path, COUNT(*) as views,
           MIN(created_at) as first_view,
           MAX(created_at) as last_view
    FROM page_views
    WHERE site_id = ? AND created_at >= ?
    GROUP BY path
    ORDER BY views DESC
    LIMIT ?
  `).bind(siteId, dateLimit.toISOString(), limit).all();

  return json({ success: true, data: result.results });
}

async function getAnalyticsReferrers(url: URL, env: Env): Promise<Response> {
  const siteId = url.searchParams.get("site_id");
  const days = parseInt(url.searchParams.get("days") || "30");
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  let query = `
    SELECT
      CASE
        WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
        ELSE referrer
      END as source,
      COUNT(*) as views
    FROM page_views
    WHERE created_at >= ?
  `;
  const params: string[] = [dateLimit.toISOString()];

  if (siteId) {
    query += " AND site_id = ?";
    params.push(siteId);
  }

  query += " GROUP BY source ORDER BY views DESC LIMIT 20";

  const result = await env.DB.prepare(query).bind(...params).all();

  return json({ success: true, data: result.results });
}
