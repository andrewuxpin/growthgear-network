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
    description: "Practical machine learning guides and tutorials covering algorithms, model training, deployment, and production ML systems for business applications.",
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    description: "In-depth reviews and guides for the best AI tools, platforms, and software to boost productivity, automate workflows, and drive business growth.",
  },
  {
    slug: "deep-learning",
    name: "Deep Learning",
    description: "Comprehensive deep learning guides covering neural networks, transformers, and advanced architectures to help you build and deploy AI systems.",
  },
];
