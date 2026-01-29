/**
 * Format a date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

/**
 * Format a date as ISO string for datetime attributes
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Convert a string to URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate reading time from word count
 * Average reading speed: 200-250 words per minute
 */
export function readingTime(wordCount: number, wordsPerMinute = 225): number {
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 0).length;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number, suffix = "..."): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength - suffix.length).trim();
  // Avoid cutting in the middle of a word
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + suffix;
}

/**
 * Generate table of contents from markdown headings
 */
export function generateTOC(content: string): { depth: number; text: string; slug: string }[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: { depth: number; text: string; slug: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    const slug = slugify(text);
    toc.push({ depth, text, slug });
  }

  return toc;
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  const stripped = stripHtml(content);
  return truncate(stripped, maxLength);
}

/**
 * Check if a date is older than specified months
 */
export function isOlderThan(date: Date | string, months: number): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const threshold = new Date();
  threshold.setMonth(threshold.getMonth() - months);
  return d < threshold;
}

/**
 * Generate UTM parameters for sponsored links
 */
export function generateUtmParams(params: {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
}): string {
  const utm = new URLSearchParams({
    utm_source: params.source,
    utm_medium: params.medium,
    utm_campaign: params.campaign,
  });
  if (params.content) {
    utm.set("utm_content", params.content);
  }
  return utm.toString();
}

/**
 * Append UTM parameters to a URL
 */
export function appendUtmToUrl(url: string, utmParams: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${utmParams}`;
}
