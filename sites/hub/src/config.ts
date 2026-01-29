import type { SiteConfig } from "@growthgear/shared/types";

export const siteConfig: SiteConfig = {
  site: {
    id: "hub",
    name: "GrowthGear Hub",
    niche: "business-growth",
    theme: "hub",
    description: "Your central resource for business growth, productivity, and entrepreneurship insights.",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Productivity", href: "/productivity" },
    { label: "Entrepreneurship", href: "/entrepreneurship" },
    { label: "Business Strategy", href: "/business-strategy" },
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
    titleTemplate: "%s | GrowthGear Hub",
    defaultDescription: "Your central resource for business growth, productivity, and entrepreneurship insights.",
    siteUrl: "https://growthgear-hub.pages.dev",
  },
};

export const categories = [
  {
    slug: "productivity",
    name: "Productivity",
    description: "Tools, systems, and strategies to maximize your output and work smarter.",
  },
  {
    slug: "entrepreneurship",
    name: "Entrepreneurship",
    description: "Start, grow, and scale your business with proven entrepreneurial wisdom.",
  },
  {
    slug: "business-strategy",
    name: "Business Strategy",
    description: "Strategic frameworks and insights for sustainable business growth.",
  },
];
