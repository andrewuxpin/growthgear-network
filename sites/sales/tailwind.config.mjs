import sharedConfig from "../../packages/shared/tailwind.config.js";

/** @type {import('tailwindcss').Config} */
export default {
  ...sharedConfig,
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "../../packages/shared/src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
};
