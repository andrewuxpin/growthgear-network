import Anthropic from "@anthropic-ai/sdk";
import type {
  ArticleRequest,
  GeneratedArticle,
  ContentGeneratorConfig,
} from "./types";

const SYSTEM_PROMPT = `You are an expert SEO content writer. You create comprehensive, engaging, and well-researched articles that rank well in search engines while providing genuine value to readers.

Your articles MUST include:
- Professional but approachable tone
- Proper heading hierarchy (H2, H3, H4)
- Primary keyword naturally in the first 100 words
- Bullet points and numbered lists where appropriate
- Specific examples, statistics, and actionable advice
- FAQ section optimized for featured snippets

**CRITICAL: Content Must Be Current**
- Always use the current year provided in the prompt
- Never reference past years (2024, 2025) as if they are current
- Use phrases like "in [current year]" or "[current year] and beyond"
- Statistics and data should be recent (within last 1-2 years)
- If referencing older studies, acknowledge the year and note if still relevant

**CRITICAL SEO Requirements for Links:**
- INTERNAL LINKS: Include 3-5 links to existing articles (provided in the prompt). Embed them naturally within relevant paragraphs using markdown: [anchor text](/slug)
- EXTERNAL LINKS: Include 3-5 links to authoritative external sources (industry reports, research studies, official documentation, major publications like HBR, Forbes, etc.). Use markdown: [source name](https://full-url)
- Links should be contextually relevant and add value for readers
- Spread links throughout the article, not clustered in one section

Always respond with valid JSON matching the requested format.`;

// Default valid categories per site (must match site config.ts)
const SITE_CATEGORIES: Record<string, string[]> = {
  ai: ["machine-learning", "ai-tools", "deep-learning"],
  sales: ["b2b-sales", "sales-techniques", "crm-tools"],
  marketing: ["content-marketing", "seo", "social-media"],
};

function buildPrompt(request: ArticleRequest): string {
  const currentYear = new Date().getFullYear();

  const existingArticlesText = request.existingArticles?.length
    ? `\n**INTERNAL LINKS - You MUST link to 3-5 of these existing articles within your content:**\n${request.existingArticles
        .map((a) => `- "${a.title}" → use markdown link: [relevant anchor text](/${a.slug})`)
        .join("\n")}`
    : "\n**No existing articles to link to yet - focus on external links.**";

  // Get valid categories for this site
  const validCategories = request.validCategories ||
    SITE_CATEGORIES[request.siteId] ||
    ["general"];
  const categoriesText = `\n**Valid Categories (MUST use one of these):** ${validCategories.join(", ")}`;

  return `Write a comprehensive, SEO-optimized article on the following topic:

**IMPORTANT: The current year is ${currentYear}. All content must be current and up-to-date. When referencing years (e.g., "best tools in ${currentYear}"), always use ${currentYear} or "${currentYear} and beyond". Never reference past years like 2024 or 2025 as current.**

**Primary Keyword:** ${request.keyword}
**Niche:** ${request.niche}
**Article Type:** ${request.articleType}
**Target Word Count:** ${request.targetWordCount || 2500} words
${categoriesText}
${existingArticlesText}

**CRITICAL REQUIREMENTS:**

**Content Structure:**
1. Professional but approachable tone
2. Proper heading hierarchy (H2, H3, H4) - use markdown format
3. Primary keyword in first 100 words and naturally throughout
4. Compelling introduction that hooks the reader
5. 5-7 FAQ questions at end (formatted as ### headings for featured snippets)
6. Bullet points and numbered lists where appropriate
7. Specific examples, statistics, and actionable advice

**SEO & Linking (VERY IMPORTANT):**
8. INTERNAL LINKS: Embed 3-5 links to the existing articles listed above. Place them naturally within relevant paragraphs using markdown: [descriptive anchor text](/article-slug)
9. EXTERNAL LINKS: Include 3-5 links to authoritative external sources (research studies, industry reports, official documentation, major publications). Use full URLs: [source name](https://example.com/page). Good sources include: industry research firms, government statistics, academic studies, major business publications (HBR, Forbes, etc.), official tool/platform documentation.
10. Spread links throughout the article - don't cluster them all in one section

**Meta & Technical:**
11. Meta title: 50-60 characters, keyword near front
12. Meta description: 150-160 characters with keyword + compelling CTA
13. Generate a URL-safe slug from the title
14. IMPORTANT: Category MUST be one of the valid categories listed above

**Image Prompt Guidelines:**
- Describe a specific visual SCENE related to the topic (people, objects, environment)
- Focus on what can be SEEN: lighting, colors, composition, setting
- NEVER include words like "text", "title", "heading", "label", "sign", "banner" - the AI will add unwanted text
- Describe physical objects and actions, not abstract concepts
- Example good prompt: "data scientist analyzing colorful charts on multiple monitors in modern tech office, dramatic blue lighting"
- Example bad prompt: "machine learning concept with AI text overlay" (will generate ugly text)

**Output Format (JSON only, no markdown code blocks):**
{
  "title": "Full article title",
  "slug": "url-safe-slug",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "Meta description 150-160 chars with keyword and CTA",
  "content": "Full markdown article content WITH EMBEDDED INTERNAL AND EXTERNAL LINKS as markdown [text](url)",
  "category": "one-of-the-valid-categories",
  "faq": [
    {"question": "Question text?", "answer": "Detailed answer text"}
  ],
  "internalLinks": [
    {"slug": "existing-article-slug", "anchorText": "anchor text used in content"}
  ],
  "externalLinks": [
    {"url": "https://example.com/source", "anchorText": "source name", "context": "why this source is relevant"}
  ],
  "imageAltText": "Descriptive alt text for featured image",
  "imagePrompt": "Visual scene description for photorealistic image - describe objects, people, lighting, setting - NO text/words/labels"
}

IMPORTANT: The "content" field MUST contain the actual markdown links embedded naturally in sentences. Do not just list links separately - weave them into the article text where they add value.`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function countWords(text: string): number {
  return text
    .replace(/[#*_`\[\]]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export class ContentGenerator {
  private client: Anthropic;
  private model: string;

  constructor(config: ContentGeneratorConfig) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.model = config.model || "claude-sonnet-4-20250514";
  }

  async generateArticle(request: ArticleRequest): Promise<GeneratedArticle> {
    const prompt = buildPrompt(request);

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system: SYSTEM_PROMPT,
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
    jsonText = jsonText.trim();

    const parsed = JSON.parse(jsonText);

    // Ensure slug is URL-safe
    const slug = parsed.slug || slugify(parsed.title);

    // Calculate word count
    const wordCount = countWords(parsed.content);

    // Validate category against allowed list
    const validCategories = request.validCategories ||
      SITE_CATEGORIES[request.siteId] ||
      [];
    let category = parsed.category || request.niche;

    // If category isn't valid, try to map it or use first valid category
    if (validCategories.length > 0 && !validCategories.includes(category)) {
      // Try common mappings
      const lowerCategory = category.toLowerCase();
      if (lowerCategory.includes("tool")) {
        category = validCategories.find(c => c.includes("tool")) || validCategories[0];
      } else if (lowerCategory.includes("learn") || lowerCategory.includes("ml")) {
        category = validCategories.find(c => c.includes("learning")) || validCategories[0];
      } else {
        category = validCategories[0];
      }
    }

    // Ensure imageAltText has a value
    const imageAltText = parsed.imageAltText || `${parsed.title} - ${request.niche}`;

    // Ensure imagePrompt has a value - fall back to generating from title and niche
    const imagePrompt = parsed.imagePrompt ||
      `Professional photo representing ${parsed.title.toLowerCase()}, ${request.niche} concept, modern office setting, cinematic lighting`;

    return {
      title: parsed.title,
      slug,
      metaTitle: parsed.metaTitle,
      metaDescription: parsed.metaDescription,
      content: parsed.content,
      wordCount,
      faq: parsed.faq || [],
      internalLinks: parsed.internalLinks || [],
      externalLinks: parsed.externalLinks || [],
      imageAltText,
      imagePrompt,
      category,
    };
  }

  async refreshArticle(
    existingContent: string,
    keyword: string,
    niche: string
  ): Promise<{ content: string; changesSummary: string }> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `You are updating an existing article to ensure it remains current and accurate.

**Primary Keyword:** ${keyword}
**Niche:** ${niche}

**Current Article Content:**
${existingContent}

**Task:**
1. Update any outdated information, statistics, or references
2. Add new developments or trends in the field
3. Improve SEO optimization if needed
4. Maintain the same overall structure and tone
5. Keep all existing internal links

**Output Format (JSON):**
{
  "content": "Updated markdown article content",
  "changesSummary": "Brief summary of what was updated"
}`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response");
    }

    let jsonText = textContent.text.trim();
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
}
