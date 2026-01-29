import Anthropic from "@anthropic-ai/sdk";

export interface Env {
  DB: D1Database;
  ANTHROPIC_API_KEY: string;
}

interface Site {
  id: string;
  name: string;
  niche: string;
}

interface ExistingKeyword {
  keyword: string;
}

const KEYWORDS_PER_SITE = 25;

async function generateKeywords(
  client: Anthropic,
  site: Site,
  existingKeywords: string[]
): Promise<string[]> {
  const existingList = existingKeywords.length > 0
    ? `\n\nExisting keywords to avoid duplicating:\n${existingKeywords.slice(0, 50).join(", ")}`
    : "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are an SEO keyword research expert. Generate ${KEYWORDS_PER_SITE} high-value, long-tail keywords for a website in the "${site.niche}" niche.

Requirements:
1. Focus on informational and commercial intent keywords
2. Include a mix of:
   - "How to" keywords (tutorials)
   - "Best" keywords (listicles/comparisons)
   - "What is" keywords (explainers)
   - Problem-solving keywords
   - Trending topics in the niche
3. Target keywords with 3-7 words (long-tail)
4. Avoid overly competitive head terms
5. Make them specific and actionable
${existingList}

Output ONLY a JSON array of keyword strings, no explanations:
["keyword 1", "keyword 2", ...]`,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  let jsonText = textContent.text.trim();

  // Remove markdown code blocks if present
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith("```")) {
    jsonText = jsonText.slice(0, -3);
  }

  return JSON.parse(jsonText.trim());
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log("Keyword generator triggered at:", new Date(event.scheduledTime).toISOString());

    try {
      const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

      // Get all sites
      const sites = await env.DB.prepare("SELECT id, name, niche FROM sites").all<Site>();

      if (!sites.results.length) {
        console.log("No sites configured");
        return;
      }

      for (const site of sites.results) {
        console.log(`Generating keywords for: ${site.name}`);

        // Get existing keywords to avoid duplicates
        const existing = await env.DB.prepare(
          "SELECT keyword FROM keywords WHERE site_id = ?"
        )
          .bind(site.id)
          .all<ExistingKeyword>();

        const existingKeywords = existing.results.map((k) => k.keyword);

        // Generate new keywords
        const newKeywords = await generateKeywords(client, site, existingKeywords);

        // Filter out duplicates
        const uniqueKeywords = newKeywords.filter(
          (kw) => !existingKeywords.some(
            (existing) => existing.toLowerCase() === kw.toLowerCase()
          )
        );

        console.log(`Generated ${uniqueKeywords.length} unique keywords`);

        // Insert new keywords
        for (const keyword of uniqueKeywords) {
          await env.DB.prepare(
            "INSERT INTO keywords (site_id, keyword, status) VALUES (?, ?, 'queued')"
          )
            .bind(site.id, keyword)
            .run();
        }

        console.log(`Added ${uniqueKeywords.length} keywords for ${site.name}`);
      }

      console.log("Keyword generation completed");
    } catch (error) {
      console.error("Keyword generator failed:", error);
      throw error;
    }
  },

  // HTTP handler for manual triggering
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/trigger") {
      const event = { scheduledTime: Date.now(), cron: "manual" } as ScheduledEvent;
      await this.scheduled(event, env, {} as ExecutionContext);
      return new Response(JSON.stringify({ success: true, message: "Keyword generation triggered" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "GET" && url.pathname === "/status") {
      const stats = await env.DB.prepare(
        "SELECT site_id, COUNT(*) as count FROM keywords WHERE status = 'queued' GROUP BY site_id"
      ).all();

      return new Response(JSON.stringify({ success: true, data: stats.results }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      name: "GrowthGear Keyword Generator",
      endpoints: {
        "POST /trigger": "Manually trigger keyword generation",
        "GET /status": "Get queued keyword counts",
      },
    }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
