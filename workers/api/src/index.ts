import { ContentGenerator } from "@growthgear/content-engine";
import type { ArticleRequest, GeneratedArticle } from "@growthgear/content-engine";

export interface Env {
  DB: D1Database;
  AI: Ai;
  IMAGES: R2Bucket;
  ANTHROPIC_API_KEY: string;
  ADMIN_API_KEY: string;
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

  let query = "SELECT id, site_id, slug, title, meta_description, primary_keyword, word_count, status, published_at, is_sponsored FROM articles WHERE 1=1";
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
  const allowedFields = ["title", "meta_description", "content", "word_count", "status", "published_at"];
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(body[field] as string | number | null);
    }
  }

  if (updates.length === 0) {
    return json({ success: false, error: "No updates provided" }, 400);
  }

  params.push(id);
  await env.DB.prepare(`UPDATE articles SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
  return json({ success: true });
}

// === Content Generation ===
async function generateContent(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as ArticleRequest;

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
    `INSERT INTO articles (site_id, slug, title, meta_description, primary_keyword, content, word_count, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')
     RETURNING id`
  )
    .bind(
      body.siteId,
      article.slug,
      article.title,
      article.metaDescription,
      body.keyword,
      article.content,
      article.wordCount
    )
    .first<{ id: number }>();

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

// === Image Generation ===
async function generateImage(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { prompt: string; articleId?: number };

  if (!body.prompt) {
    return json({ success: false, error: "Missing required field: prompt" }, 400);
  }

  try {
    // Enhance prompt for better results
    const enhancedPrompt = `${body.prompt}, professional photography, high quality, detailed, sharp focus, well-lit, 4k, no text, no watermarks`;

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
