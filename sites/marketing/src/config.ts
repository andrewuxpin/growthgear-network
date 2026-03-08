import type { SiteConfig } from "@growthgear/shared/types";

export const siteConfig: SiteConfig = {
  site: {
    id: "marketing",
    name: "Marketing Edge",
    niche: "marketing",
    theme: "marketing",
    description: "Cutting-edge digital marketing strategies, growth hacks, and insights to scale your business.",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Content Marketing", href: "/content-marketing" },
    { label: "SEO", href: "/seo" },
    { label: "Social Media", href: "/social-media" },
    { label: "About", href: "/about" },
  ],
  footer: {
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    social: [
      { platform: "twitter", href: "https://twitter.com/growthgear" },
      { platform: "linkedin", href: "https://linkedin.com/company/growthgear" },
    ],
  },
  seo: {
    titleTemplate: "%s | Marketing Edge",
    defaultDescription: "Cutting-edge digital marketing strategies, growth hacks, and insights to scale your business.",
    siteUrl: "https://marketing.growthgear.com.au",
  },
};

export const categories = [
  {
    slug: "content-marketing",
    name: "Content Marketing",
    description: "Create compelling content that drives traffic, builds authority, and converts readers into customers. Practical content marketing strategies for digital growth.",
  },
  {
    slug: "seo",
    name: "SEO",
    description: "Search engine optimization strategies to rank higher, drive organic traffic, and outperform competitors. From technical SEO to content optimization.",
  },
  {
    slug: "social-media",
    name: "Social Media",
    description: "Build your brand, grow followers, and engage audiences across social media platforms. Data-driven strategies for Instagram, LinkedIn, TikTok, and beyond.",
  },
];
