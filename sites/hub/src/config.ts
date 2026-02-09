import type { SiteConfig } from "@growthgear/shared/types";

export const siteConfig: SiteConfig = {
  site: {
    id: "hub",
    name: "GrowthGear",
    niche: "business-growth",
    theme: "hub",
    description: "Your network of expert resources for AI, sales, and marketing success.",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "AI Insights", href: "https://ai.growthgear.com.au" },
    { label: "Sales Mastery", href: "https://sales.growthgear.com.au" },
    { label: "Marketing Edge", href: "https://marketing.growthgear.com.au" },
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
    titleTemplate: "%s | GrowthGear",
    defaultDescription: "Your network of expert resources for AI, sales, and marketing success.",
    siteUrl: "https://hub.growthgear.com.au",
  },
};

// Network sites for the hub directory
export const networkSites = [
  {
    id: "ai",
    name: "AI Insights",
    tagline: "Master Artificial Intelligence",
    description: "Expert insights on AI, machine learning, and the future of intelligent systems. Stay ahead with actionable guides and the latest trends.",
    url: "https://ai.growthgear.com.au",
    color: "from-violet-500 to-purple-600",
    icon: "🤖",
    topics: ["Machine Learning", "AI Tools", "Deep Learning", "ChatGPT & LLMs"],
  },
  {
    id: "sales",
    name: "Sales Mastery",
    tagline: "Close More Deals",
    description: "Proven strategies, techniques, and insights for B2B and B2C success. Master the art of selling and accelerate your revenue.",
    url: "https://sales.growthgear.com.au",
    color: "from-emerald-500 to-teal-600",
    icon: "💼",
    topics: ["B2B Sales", "Sales Techniques", "CRM & Tools", "Negotiation"],
  },
  {
    id: "marketing",
    name: "Marketing Edge",
    tagline: "Grow Your Audience",
    description: "Cutting-edge digital marketing strategies, growth hacks, and insights to scale your business and build your brand.",
    url: "https://marketing.growthgear.com.au",
    color: "from-orange-500 to-red-600",
    icon: "📈",
    topics: ["Content Marketing", "SEO", "Social Media", "Growth Hacking"],
  },
];
