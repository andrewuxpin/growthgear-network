import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://growthgear-marketing.pages.dev",
  integrations: [
    tailwind({
      configFile: "./tailwind.config.mjs",
    }),
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
