import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://marketing.growthgear.com.au",
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
