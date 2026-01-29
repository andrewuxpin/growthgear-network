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

function buildPrompt(request: ArticleRequest): string {
  const existingArticlesText = request.existingArticles?.length
    ? `\n**Existing articles to link to:**\n${request.existingArticles
        .map((a) => `- ${a.title} (/${a.slug})`)
        .join("\n")}`
    : "";

  return `Write a comprehensive, SEO-optimized article on the following topic:

**Primary Keyword:** ${request.keyword}
**Niche:** ${request.niche}
**Article Type:** ${request.articleType}
**Target Word Count:** ${request.targetWordCount || 2500} words
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

**Output Format (JSON only, no markdown code blocks):**
{
  "title": "Full article title",
  "slug": "url-safe-slug",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "Meta description 150-160 chars with keyword and CTA",
  "content": "Full markdown article content with proper headings",
  "category": "suggested category slug",
  "faq": [
    {"question": "Question text?", "answer": "Detailed answer text"}
  ],
  "internalLinks": [
    {"slug": "existing-article-slug", "anchorText": "anchor text to use"}
  ],
  "imageAltText": "Descriptive alt text for featured image",
  "imagePrompt": "Detailed prompt for generating a photorealistic featured image"
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
      category: parsed.category || request.niche,
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
