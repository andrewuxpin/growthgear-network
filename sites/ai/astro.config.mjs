import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ai.growthgear.com.au",
  integrations: [
    tailwind({
      configFile: "./tailwind.config.mjs",
    }),
    sitemap(),
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
