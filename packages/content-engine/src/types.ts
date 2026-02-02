export interface ArticleRequest {
  keyword: string;
  siteId: string;
  niche: string;
  articleType: "listicle" | "how-to" | "comparison" | "pillar" | "guide";
  targetWordCount?: number;
  existingArticles?: { slug: string; title: string }[];
  validCategories?: string[];
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  wordCount: number;
  faq: FAQ[];
  internalLinks: InternalLink[];
  imageAltText: string;
  imagePrompt: string;
  category: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface InternalLink {
  slug: string;
  anchorText: string;
}

export interface ContentGeneratorConfig {
  apiKey: string;
  model?: string;
}

export interface ImageGeneratorConfig {
  apiKey: string;
  provider: "flux" | "dalle";
}

export interface GeneratedImage {
  url: string;
  altText: string;
}

export interface Site {
  id: string;
  name: string;
  domain: string | null;
  niche: string;
  themeConfig: string | null;
}

export interface Keyword {
  id: number;
  siteId: string;
  keyword: string;
  searchVolume: number | null;
  difficulty: number | null;
  status: "queued" | "processing" | "completed" | "failed";
  assignedArticleId: number | null;
}

export interface Article {
  id: number;
  siteId: string;
  slug: string;
  title: string;
  metaDescription: string | null;
  primaryKeyword: string | null;
  content: string | null;
  wordCount: number | null;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  refreshedAt: string | null;
  isSponsored: boolean;
  sponsorId: number | null;
}

export interface ScheduledJob {
  id: number;
  jobType: "generate" | "refresh" | "publish";
  siteId: string;
  status: "pending" | "processing" | "completed" | "failed";
  scheduledFor: string;
  completedAt: string | null;
  errorMessage: string | null;
}
