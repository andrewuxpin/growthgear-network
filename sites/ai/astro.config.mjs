import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://ai.growthgear.com.au",
  integrations: [
    tailwind({
      configFile: "./tailwind.config.mjs",
    }),
    // TODO: Re-enable sitemap after fixing version compatibility
    // sitemap({ filter: (page) => !page.includes("/api/") }),
  ],
  build: {
    inlineStylesheets: "auto",
  },
  image: {
    domains: ["images.unsplash.com"],
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
