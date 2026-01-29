export interface Site {
  id: string;
  name: string;
  domain?: string;
  niche: string;
  theme: "ai" | "sales" | "marketing" | "hub";
  description: string;
  logo?: string;
}

export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: Author;
  publishedAt: Date;
  updatedAt?: Date;
  image?: {
    src: string;
    alt: string;
  };
  tags?: string[];
  readingTime: number;
  wordCount: number;
  isSponsored?: boolean;
  sponsorId?: number;
  faq?: FAQ[];
  tableOfContents?: TOCItem[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface TOCItem {
  depth: number;
  text: string;
  slug: string;
}

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SiteConfig {
  site: Site;
  navigation: NavItem[];
  footer: {
    links: { label: string; href: string }[];
    social: { platform: string; href: string; icon: string }[];
  };
  seo: {
    titleTemplate: string;
    defaultDescription: string;
    siteUrl: string;
  };
}

export interface ArticleLink {
  fromSlug: string;
  toSlug: string;
  anchorText: string;
}

export interface Sponsor {
  id: number;
  name: string;
  email: string;
  company?: string;
}

export interface SponsoredLink {
  id: number;
  sponsorId: number;
  articleId: number;
  targetUrl: string;
  anchorText: string;
  utmCampaign?: string;
  clicks: number;
}
