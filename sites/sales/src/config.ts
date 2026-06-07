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
    defaultDescription: "Master the art of sales with proven strategies, techniques, and tools. Expert guides on B2B sales, CRM, pipeline management, and closing deals to grow your.",
    siteUrl: "https://sales.growthgear.com.au",
  },
};

export const categories = [
  {
    slug: "b2b-sales",
    name: "B2B Sales",
    description: "Enterprise B2B sales strategies, account-based selling techniques, and expert guides to win complex deals, build relationships, and scale revenue.",
  },
  {
    slug: "sales-techniques",
    name: "Sales Techniques",
    description: "Proven sales methodologies, closing techniques, and negotiation tactics to help sales professionals convert prospects, handle objections, and exceed targets.",
  },
  {
    slug: "crm-tools",
    name: "CRM & Tools",
    description: "Expert reviews and guides for the best sales tools, CRMs, and automation platforms to streamline your sales process and close more deals efficiently.",
  },
];
