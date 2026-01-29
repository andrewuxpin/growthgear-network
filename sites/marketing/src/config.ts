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
    siteUrl: "https://growthgear-marketing.pages.dev",
  },
};

export const categories = [
  {
    slug: "content-marketing",
    name: "Content Marketing",
    description: "Create compelling content that drives traffic, engagement, and conversions.",
  },
  {
    slug: "seo",
    name: "SEO",
    description: "Search engine optimization strategies to rank higher and drive organic growth.",
  },
  {
    slug: "social-media",
    name: "Social Media",
    description: "Build your brand and engage audiences across social platforms.",
  },
];
