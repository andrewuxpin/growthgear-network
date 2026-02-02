import { ContentGenerator } from "@growthgear/content-engine";

export interface Env {
  DB: D1Database;
  AI: Ai;
  IMAGES: R2Bucket;
  ANTHROPIC_API_KEY: string;
  AUTO_PUBLISH: string;
  GENERATE_IMAGES: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string; // e.g., "username/growthgear-network"
}

interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

interface Site {
  id: string;
  name: string;
  niche: string;
}

interface Keyword {
  id: number;
  site_id: string;
  keyword: string;
}

const ARTICLES_PER_SITE_PER_RUN = 3; // ~3 articles per day = 21 per week

async function triggerGitHubDeploy(env: Env): Promise<void> {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
    console.log("GitHub deploy trigger not configured, skipping...");
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GrowthGear-Scheduler",
        },
        body: JSON.stringify({
          event_type: "deploy-sites",
        }),
      }
    );

    if (response.ok) {
      console.log("GitHub deploy action triggered successfully");
    } else {
      console.error("Failed to trigger GitHub deploy:", await response.text());
    }
  } catch (error) {
    console.error("Error triggering GitHub deploy:", error);
  }
}

async function generateImage(
  prompt: string,
  articleId: number,
  env: Env
): Promise<string | null> {
  try {
    const enhancedPrompt = `${prompt}, photorealistic, professional photography, sharp focus, cinematic lighting, 4k quality`;

    const response = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
      prompt: enhancedPrompt,
      num_steps: 4,
    });

    const imageData = response as Uint8Array;

    // Generate unique filename
    const timestamp = Date.now();
    const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
    const filename = `${timestamp}-${slug}.png`;

    // Store in R2
    await env.IMAGES.put(filename, imageData, {
      httpMetadata: {
        contentType: "image/png",
      },
      customMetadata: {
        prompt,
        articleId: articleId.toString(),
      },
    });

    // Update article with image
    await env.DB.prepare(
      "UPDATE articles SET featured_image = ? WHERE id = ?"
    ).bind(filename, articleId).run();

    return filename;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log("Content scheduler triggered at:", new Date(event.scheduledTime).toISOString());

    const autoPublish = env.AUTO_PUBLISH === "true";
    const generateImages = env.GENERATE_IMAGES === "true";

    try {
      // Get all active sites
      const sites = await env.DB.prepare("SELECT id, name, niche FROM sites")
        .all<Site>();

      if (!sites.results.length) {
        console.log("No sites configured");
        return;
      }

      const generator = new ContentGenerator({ apiKey: env.ANTHROPIC_API_KEY });

      for (const site of sites.results) {
        console.log(`Processing site: ${site.name} (${site.id})`);

        // Get queued keywords for this site
        const keywords = await env.DB.prepare(
          `SELECT id, site_id, keyword FROM keywords
           WHERE site_id = ? AND status = 'queued'
           ORDER BY search_volume DESC, created_at ASC
           LIMIT ?`
        )
          .bind(site.id, ARTICLES_PER_SITE_PER_RUN)
          .all<Keyword>();

        if (!keywords.results.length) {
          console.log(`No queued keywords for site ${site.id}`);
          continue;
        }

        // Get existing articles for internal linking
        const existingArticles = await env.DB.prepare(
          "SELECT slug, title FROM articles WHERE site_id = ? AND status = 'published' LIMIT 20"
        )
          .bind(site.id)
          .all<{ slug: string; title: string }>();

        for (const kw of keywords.results) {
          try {
            console.log(`Generating article for keyword: ${kw.keyword}`);

            // Mark keyword as processing
            await env.DB.prepare("UPDATE keywords SET status = 'processing' WHERE id = ?")
              .bind(kw.id)
              .run();

            // Generate article
            const article = await generator.generateArticle({
              keyword: kw.keyword,
              siteId: site.id,
              niche: site.niche,
              articleType: "guide",
              existingArticles: existingArticles.results,
            });

            // Determine status based on auto-publish setting
            const status = autoPublish ? "published" : "draft";
            const publishedAt = autoPublish ? new Date().toISOString() : null;

            // Save article to database
            const result = await env.DB.prepare(
              `INSERT INTO articles (site_id, slug, title, meta_description, primary_keyword, category, content, word_count, image_alt, status, published_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               RETURNING id`
            )
              .bind(
                site.id,
                article.slug,
                article.title,
                article.metaDescription,
                kw.keyword,
                article.category || null,
                article.content,
                article.wordCount,
                article.imageAltText || null,
                status,
                publishedAt
              )
              .first<{ id: number }>();

            const articleId = result?.id;

            // Generate image if enabled
            if (generateImages && articleId && article.imagePrompt) {
              console.log(`Generating image for article: ${article.title}`);
              const imageFilename = await generateImage(article.imagePrompt, articleId, env);
              if (imageFilename) {
                console.log(`Image generated: ${imageFilename}`);
              }
            }

            // Update keyword status
            await env.DB.prepare(
              "UPDATE keywords SET status = 'completed', assigned_article_id = ? WHERE id = ?"
            )
              .bind(articleId, kw.id)
              .run();

            console.log(`Article ${status}: ${article.title} (${article.wordCount} words)`);

            // Log the job
            await env.DB.prepare(
              `INSERT INTO scheduled_jobs (job_type, site_id, status, scheduled_for, completed_at)
               VALUES ('generate', ?, 'completed', ?, datetime('now'))`
            )
              .bind(site.id, new Date(event.scheduledTime).toISOString())
              .run();
          } catch (error) {
            console.error(`Error generating article for keyword ${kw.keyword}:`, error);

            // Mark keyword as failed
            await env.DB.prepare("UPDATE keywords SET status = 'failed' WHERE id = ?")
              .bind(kw.id)
              .run();

            // Log the failed job
            await env.DB.prepare(
              `INSERT INTO scheduled_jobs (job_type, site_id, status, scheduled_for, error_message)
               VALUES ('generate', ?, 'failed', ?, ?)`
            )
              .bind(
                site.id,
                new Date(event.scheduledTime).toISOString(),
                error instanceof Error ? error.message : "Unknown error"
              )
              .run();
          }
        }
      }

      // Trigger GitHub Action to rebuild and deploy sites
      await triggerGitHubDeploy(env);

      console.log("Content scheduler completed successfully");
    } catch (error) {
      console.error("Content scheduler failed:", error);
      throw error;
    }
  },

  // HTTP handler for manual triggering and status
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Manual trigger endpoint
    if (request.method === "POST" && url.pathname === "/trigger") {
      const event = { scheduledTime: Date.now(), cron: "manual" } as ScheduledEvent;
      await this.scheduled(event, env, {} as ExecutionContext);
      return new Response(JSON.stringify({ success: true, message: "Scheduler triggered" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Status endpoint
    if (request.method === "GET" && url.pathname === "/status") {
      const [queuedKeywords, recentJobs] = await Promise.all([
        env.DB.prepare("SELECT COUNT(*) as count FROM keywords WHERE status = 'queued'")
          .first<{ count: number }>(),
        env.DB.prepare(
          "SELECT * FROM scheduled_jobs ORDER BY scheduled_for DESC LIMIT 10"
        ).all(),
      ]);

      return new Response(JSON.stringify({
        success: true,
        data: {
          queuedKeywords: queuedKeywords?.count || 0,
          autoPublish: env.AUTO_PUBLISH === "true",
          generateImages: env.GENERATE_IMAGES === "true",
          recentJobs: recentJobs.results,
        },
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      name: "GrowthGear Content Scheduler",
      endpoints: {
        "POST /trigger": "Manually trigger the scheduler",
        "GET /status": "Get scheduler status",
      },
    }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
