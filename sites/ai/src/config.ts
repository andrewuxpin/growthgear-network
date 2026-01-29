import type { SiteConfig } from "@growthgear/shared/types";

export const siteConfig: SiteConfig = {
  site: {
    id: "ai",
    name: "AI Insights",
    niche: "artificial-intelligence",
    theme: "ai",
    description: "Expert insights on AI, machine learning, and the future of intelligent systems.",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Machine Learning", href: "/machine-learning" },
    { label: "AI Tools", href: "/ai-tools" },
    { label: "Deep Learning", href: "/deep-learning" },
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
    titleTemplate: "%s | AI Insights",
    defaultDescription: "Expert insights on AI, machine learning, and the future of intelligent systems. Stay ahead with actionable advice and in-depth guides.",
    siteUrl: "https://ai.growthgear.com.au",
  },
};

export const categories = [
  {
    slug: "machine-learning",
    name: "Machine Learning",
    description: "Practical guides and tutorials on machine learning algorithms, frameworks, and best practices.",
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    description: "Reviews and guides for the best AI tools and platforms to boost your productivity.",
  },
  {
    slug: "deep-learning",
    name: "Deep Learning",
    description: "Deep dives into neural networks, transformers, and advanced AI architectures.",
  },
];
