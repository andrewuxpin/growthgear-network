import type { SiteConfig } from "@growthgear/shared/types";

export const siteConfig: SiteConfig = {
  site: {
    id: "sales",
    name: "Sales Mastery",
    niche: "sales",
    theme: "sales",
    description: "Master the art of sales with proven strategies, techniques, and insights for B2B and B2C success.",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "B2B Sales", href: "/b2b-sales" },
    { label: "Sales Techniques", href: "/sales-techniques" },
    { label: "CRM & Tools", href: "/crm-tools" },
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
    titleTemplate: "%s | Sales Mastery",
    defaultDescription: "Master the art of sales with proven strategies, techniques, and insights for B2B and B2C success.",
    siteUrl: "https://sales.growthgear.com.au",
  },
};

export const categories = [
  {
    slug: "b2b-sales",
    name: "B2B Sales",
    description: "Enterprise sales strategies, account-based selling, and complex deal management.",
  },
  {
    slug: "sales-techniques",
    name: "Sales Techniques",
    description: "Proven methodologies, closing techniques, and negotiation tactics that work.",
  },
  {
    slug: "crm-tools",
    name: "CRM & Tools",
    description: "Reviews and guides for sales tools, CRMs, and automation platforms.",
  },
];
