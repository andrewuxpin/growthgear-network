import Anthropic from "@anthropic-ai/sdk";
import type {
  ArticleRequest,
  GeneratedArticle,
  ContentGeneratorConfig,
} from "./types";

const SYSTEM_PROMPT = `You are an expert SEO content writer. You create comprehensive, engaging, and well-researched articles that rank well in search engines while providing genuine value to readers.

Your articles should:
- Be written in a professional but approachable tone
- Use proper heading hierarchy (H2, H3, H4)
- Include the primary keyword naturally in the first 100 words
- Have bullet points and numbered lists where appropriate
- Include specific examples, statistics, and actionable advice
- Be optimized for featured snippets with FAQ sections

Always respond with valid JSON matching the requested format.`;

// Default valid categories per site (must match site config.ts)
const SITE_CATEGORIES: Record<string, string[]> = {
  ai: ["machine-learning", "ai-tools", "deep-learning"],
  sales: ["b2b-sales", "sales-techniques", "crm-tools"],
  marketing: ["content-marketing", "seo", "social-media"],
};

function buildPrompt(request: ArticleRequest): string {
  const existingArticlesText = request.existingArticles?.length
    ? `\n**Existing articles to link to:**\n${request.existingArticles
        .map((a) => `- ${a.title} (/${a.slug})`)
        .join("\n")}`
    : "";

  // Get valid categories for this site
  const validCategories = request.validCategories ||
    SITE_CATEGORIES[request.siteId] ||
    ["general"];
  const categoriesText = `\n**Valid Categories (MUST use one of these):** ${validCategories.join(", ")}`;

  return `Write a comprehensive, SEO-optimized article on the following topic:

**Primary Keyword:** ${request.keyword}
**Niche:** ${request.niche}
**Article Type:** ${request.articleType}
**Target Word Count:** ${request.targetWordCount || 2500} words
${categoriesText}
${existingArticlesText}

**Requirements:**
1. Professional but approachable tone
2. Proper heading hierarchy (H2, H3, H4) - use markdown format
3. Primary keyword in first 100 words
4. Include a compelling introduction
5. 5-7 FAQ questions at end (for featured snippets)
6. Bullet points and numbered lists where appropriate
7. Specific examples, statistics, actionable advice
8. Meta title: 50-60 characters, keyword near front
9. Meta description: 150-160 characters, keyword + call to action
10. Suggest 2-4 internal links from the existing articles list
11. Suggest alt text and image generation prompt for featured image
12. Generate a URL-safe slug from the title
13. IMPORTANT: Category MUST be one of the valid categories listed above

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
  "content": "Full markdown article content with proper headings",
  "category": "one-of-the-valid-categories",
  "faq": [
    {"question": "Question text?", "answer": "Detailed answer text"}
  ],
  "internalLinks": [
    {"slug": "existing-article-slug", "anchorText": "anchor text to use"}
  ],
  "imageAltText": "Descriptive alt text for featured image",
  "imagePrompt": "Visual scene description for photorealistic image - describe objects, people, lighting, setting - NO text/words/labels"
}`;
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

    return {
      title: parsed.title,
      slug,
      metaTitle: parsed.metaTitle,
      metaDescription: parsed.metaDescription,
      content: parsed.content,
      wordCount,
      faq: parsed.faq || [],
      internalLinks: parsed.internalLinks || [],
      imageAltText: parsed.imageAltText,
      imagePrompt: parsed.imagePrompt,
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
