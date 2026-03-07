# GrowthGear Network Blog Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign all 3 GrowthGear subdomain blogs (AI, Sales, Marketing) with MDX content, 3-column sticky layout, rich components, and SEO-optimized patterns matching the GrowthGear website blog.

**Architecture:** Add `@astrojs/mdx` integration to enable custom components in articles. Create shared Astro components (KeyTakeaways, Callout, InlineCTA, ComparisonTable, StickyToc, SocialShare, ReadingProgressBar, ImageLightbox) in `packages/shared/`. Rewrite `ArticleLayout.astro` to use 3-column grid with sticky left ToC and sticky right CTA. Redesign listing pages with Latest Post + Editor's Picks hero, mid-page CTA, search/filter, and newsletter card. Migrate all 36 articles from `.md` to `.mdx` with rich components. Update sync scripts to output `.mdx`.

**Tech Stack:** Astro 4, @astrojs/mdx, Tailwind v3, @tailwindcss/typography, pnpm workspaces, Cloudflare Pages

---

## Context

**Monorepo:** `/Users/abedearmer/Projects/growthgear-network/`
**Sites:** `sites/ai/`, `sites/sales/`, `sites/marketing/` (all share `packages/shared/`)
**Shared components:** `packages/shared/src/components/`
**Shared types:** `packages/shared/src/types/index.ts`
**Shared utils:** `packages/shared/src/utils/index.ts`
**Shared styles:** `packages/shared/src/styles/base.css`
**Tailwind:** v3 with CSS variable theming (`data-theme` attribute per site)
**Deploy:** `gh workflow dispatch deploy-sites.yml -f site=all -f skip_sync=true`

**Themes:**
- AI: purple/blue (`primary-600` = `124 58 237`, `accent-600` = `37 99 235`)
- Sales: navy/gold (`primary-600` = `30 58 95`, `accent-600` = `217 119 6`)
- Marketing: teal/coral (`primary-600` = `13 148 136`, `accent-600` = `234 88 12`)

**Articles:** 36 total (11 AI + 12 Sales + 13 Marketing), all `.md` with frontmatter

**Key existing components to modify:**
- `ArticleLayout.astro` — current 2-column (8+4), will become 3-column with sticky ToC left
- `TableOfContents.astro` — inline box above article, will become sticky sidebar
- `FAQ.astro` — uses `<details>`, will add SSR-first open pattern for SEO
- `FloatingCTA.astro` — in right sidebar, will become sticky
- `ArticleCard.astro` — used on listing pages, stays but layout around it changes

**Key existing components to keep as-is:**
- `BaseHead.astro`, `Header.astro`, `Footer.astro`, `SEO.astro`, `Analytics.astro`, `Breadcrumbs.astro`

---

## Task 1: Install @astrojs/mdx across all 3 sites

**Files:**
- Modify: `sites/ai/package.json`
- Modify: `sites/ai/astro.config.mjs`
- Modify: `sites/sales/package.json`
- Modify: `sites/sales/astro.config.mjs`
- Modify: `sites/marketing/package.json`
- Modify: `sites/marketing/astro.config.mjs`
- Modify: `sites/ai/src/content/config.ts` (add `.mdx` support)
- Modify: `sites/sales/src/content/config.ts`
- Modify: `sites/marketing/src/content/config.ts`

**Step 1: Install @astrojs/mdx in each site**

```bash
cd /Users/abedearmer/Projects/growthgear-network
pnpm --filter @growthgear/ai-site add @astrojs/mdx
pnpm --filter @growthgear/sales-site add @astrojs/mdx
pnpm --filter @growthgear/marketing-site add @astrojs/mdx
```

Check the actual package names in each site's `package.json` — they may differ. Use the `name` field from each.

**Step 2: Add MDX integration to each astro.config.mjs**

For `sites/ai/astro.config.mjs` (and identically for sales, marketing — just different `site` URLs):

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://ai.growthgear.com.au",
  integrations: [
    tailwind({
      configFile: "./tailwind.config.mjs",
    }),
    mdx(),
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
```

**Step 3: Verify content collections accept .mdx**

Astro content collections with `type: "content"` already accept `.mdx` files when `@astrojs/mdx` is installed. No schema changes needed — the existing `config.ts` files work as-is.

**Step 4: Verify build still works**

```bash
cd sites/ai && pnpm run build
```

Expected: Build succeeds with 0 errors. All existing `.md` articles still render.

**Step 5: Commit**

```bash
git add sites/ai/package.json sites/ai/astro.config.mjs sites/sales/package.json sites/sales/astro.config.mjs sites/marketing/package.json sites/marketing/astro.config.mjs pnpm-lock.yaml
git commit -m "feat: add @astrojs/mdx integration to all 3 sites"
```

---

## Task 2: Create shared MDX components (KeyTakeaways, Callout, InlineCTA, ComparisonTable)

**Files:**
- Create: `packages/shared/src/components/KeyTakeaways.astro`
- Create: `packages/shared/src/components/Callout.astro`
- Create: `packages/shared/src/components/InlineCTA.astro`
- Create: `packages/shared/src/components/ComparisonTable.astro`

These are Astro components that will be imported in `.mdx` files. They must use the theme CSS variables (`primary-*`, `accent-*`) so they adapt to each site's color scheme.

**Step 1: Create KeyTakeaways component**

`packages/shared/src/components/KeyTakeaways.astro`:

```astro
---
interface Props {
  items: string[];
}
const { items } = Astro.props;
---

<div
  class="bg-primary-50 border-l-4 border-primary-500 rounded-lg p-5 my-6"
  role="complementary"
  aria-label="Key Takeaways"
>
  <h2 id="key-takeaways" class="text-base font-bold text-gray-800 mb-3">
    Key Takeaways
  </h2>
  <ul class="list-none pl-5 mb-0 space-y-2">
    {items.map((item) => (
      <li class="text-sm text-gray-600 leading-relaxed relative before:content-['\2713'] before:text-primary-500 before:font-bold before:absolute before:-left-5">
        <Fragment set:html={item} />
      </li>
    ))}
  </ul>
</div>
```

**Step 2: Create Callout component**

`packages/shared/src/components/Callout.astro`:

```astro
---
interface Props {
  variant?: "tip" | "warning" | "pro";
  title?: string;
}

const { variant = "tip", title } = Astro.props;

const styles = {
  tip: { bg: "bg-emerald-50", border: "border-emerald-500", defaultTitle: "Pro tip" },
  warning: { bg: "bg-amber-50", border: "border-amber-500", defaultTitle: "Common mistake" },
  pro: { bg: "bg-primary-50", border: "border-primary-500", defaultTitle: "Advanced strategy" },
};

const style = styles[variant];
---

<div class={`border-l-4 rounded-lg p-5 my-6 ${style.bg} ${style.border}`}>
  <p class="text-sm font-bold text-gray-800 mb-1">{title ?? style.defaultTitle}</p>
  <div class="text-sm text-gray-600 leading-relaxed [&_p]:mb-0">
    <slot />
  </div>
</div>
```

**Step 3: Create InlineCTA component**

`packages/shared/src/components/InlineCTA.astro`:

```astro
---
interface Props {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const {
  title = "Want help implementing these ideas?",
  description = "Book a free strategy call and we'll show you the quickest AI wins for your business.",
  primaryLabel = "Book Free Strategy Call",
  secondaryLabel = "Explore Our Services",
  secondaryHref = "https://growthgear.com.au/services",
} = Astro.props;
---

<aside class="my-10 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8 text-center not-prose">
  <p class="text-lg font-semibold text-white mb-2">{title}</p>
  <p class="text-sm text-gray-400 mb-5">{description}</p>
  <div class="flex items-center justify-center gap-3 flex-wrap">
    <a
      href="#"
      onclick="Calendly.initPopupWidget({url: 'https://calendly.com/abe-growthgear/free-strategy-call?hide_gdpr_banner=1'});return false;"
      class="inline-flex h-10 items-center px-6 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition-colors cursor-pointer"
    >
      {primaryLabel}
    </a>
    <a
      href={secondaryHref}
      class="inline-flex h-10 items-center px-6 rounded-lg border border-gray-600 text-white text-sm hover:border-primary-500 hover:text-primary-400 transition-colors"
    >
      {secondaryLabel}
    </a>
  </div>
</aside>
```

**Step 4: Create ComparisonTable component**

`packages/shared/src/components/ComparisonTable.astro`:

```astro
---
// Wraps a markdown table with responsive styling
---

<div class="overflow-x-auto my-6 rounded-lg border border-gray-200 not-prose">
  <div class="min-w-full [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_th]:text-left [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-gray-800 [&_th]:font-semibold [&_th]:bg-gray-50 [&_th]:border-b [&_th]:border-gray-200 [&_td]:px-3 [&_td]:py-2.5 [&_td]:text-gray-600 [&_td]:border-b [&_td]:border-gray-100">
    <slot />
  </div>
</div>
```

**Step 5: Export new components from shared package**

The shared package uses wildcard exports (`"./components/*": "./src/components/*"`) so no `package.json` changes needed — new `.astro` files are automatically available via `@growthgear/shared/components/KeyTakeaways.astro` etc.

**Step 6: Build to verify no errors**

```bash
cd /Users/abedearmer/Projects/growthgear-network && pnpm run build
```

Expected: All 3 sites build successfully.

**Step 7: Commit**

```bash
git add packages/shared/src/components/KeyTakeaways.astro packages/shared/src/components/Callout.astro packages/shared/src/components/InlineCTA.astro packages/shared/src/components/ComparisonTable.astro
git commit -m "feat: add MDX components (KeyTakeaways, Callout, InlineCTA, ComparisonTable)"
```

---

## Task 3: Rewrite FAQ component with SSR-first SEO pattern

The current FAQ uses `<details>` which is collapsed by default — search engines may not index collapsed content. Rewrite to render all answers expanded in the initial HTML (visible to crawlers), then collapse into an accordion on hydration via a `<script>`.

**Files:**
- Modify: `packages/shared/src/components/FAQ.astro`

**Step 1: Rewrite FAQ.astro**

```astro
---
interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  title?: string;
}

const { items, title = "Frequently Asked Questions" } = Astro.props;
---

{items.length > 0 && (
  <section class="faq mt-12 pt-8 border-t border-gray-200 not-prose" data-faq-container>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
    <div class="space-y-3">
      {items.map((item, index) => (
        <div class="faq-item bg-gray-50 rounded-lg overflow-hidden" data-faq-item>
          <button
            type="button"
            class="faq-trigger flex items-center justify-between w-full cursor-pointer p-4 font-medium text-gray-900 hover:text-primary-600 transition-colors text-left"
            aria-expanded="true"
            aria-controls={`faq-answer-${index}`}
            data-faq-trigger
          >
            <span>{item.question}</span>
            <svg
              class="w-5 h-5 text-gray-500 transition-transform faq-chevron"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            id={`faq-answer-${index}`}
            class="faq-answer px-4 pb-4 text-gray-600"
            data-faq-answer
          >
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

<style>
  .faq-chevron {
    transition: transform 0.2s ease;
  }
  .faq-item[data-collapsed] .faq-chevron {
    transform: rotate(-90deg);
  }
  .faq-item[data-collapsed] .faq-answer {
    display: none;
  }
</style>

<script>
  // SSR-first: all answers are expanded in initial HTML for SEO/AEO.
  // After hydration, collapse all except the first one.
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("[data-faq-container]");
    if (!container) return;

    const items = container.querySelectorAll("[data-faq-item]");

    // Collapse all except first
    items.forEach((item, index) => {
      if (index > 0) {
        item.setAttribute("data-collapsed", "");
        const trigger = item.querySelector("[data-faq-trigger]");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });

    // Toggle on click
    container.addEventListener("click", (e) => {
      const trigger = (e.target as HTMLElement).closest("[data-faq-trigger]");
      if (!trigger) return;

      const item = trigger.closest("[data-faq-item]");
      if (!item) return;

      const isCollapsed = item.hasAttribute("data-collapsed");
      if (isCollapsed) {
        item.removeAttribute("data-collapsed");
        trigger.setAttribute("aria-expanded", "true");
      } else {
        item.setAttribute("data-collapsed", "");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });
</script>
```

**Step 2: Build and verify**

```bash
cd /Users/abedearmer/Projects/growthgear-network && pnpm run build
```

Expected: Build succeeds. FAQ answers are present in the static HTML output (check with `grep` on the built `.html` files in `sites/ai/dist/`).

**Step 3: Commit**

```bash
git add packages/shared/src/components/FAQ.astro
git commit -m "feat: rewrite FAQ with SSR-first pattern (all answers expanded in HTML for SEO)"
```

---

## Task 4: Create StickyToc, SocialShare, ReadingProgressBar, ImageLightbox components

**Files:**
- Create: `packages/shared/src/components/StickyToc.astro`
- Create: `packages/shared/src/components/SocialShare.astro`
- Create: `packages/shared/src/components/ReadingProgressBar.astro`
- Create: `packages/shared/src/components/ImageLightbox.astro`

**Step 1: Create StickyToc**

`packages/shared/src/components/StickyToc.astro`:

This replaces the inline ToC. It will be rendered in the left column of the 3-column layout. Uses `IntersectionObserver` for active heading tracking.

```astro
---
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}

const { headings } = Astro.props;
const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
---

{filtered.length > 0 && (
  <nav class="sticky-toc" aria-label="Table of contents" data-sticky-toc>
    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
      On this page
    </p>
    <ul class="space-y-1.5 text-sm">
      {filtered.map((heading) => (
        <li>
          <a
            href={`#${heading.slug}`}
            class={`block py-0.5 text-gray-500 hover:text-primary-600 transition-colors border-l-2 border-transparent hover:border-primary-400 ${heading.depth === 3 ? "pl-5" : "pl-3"}`}
            data-toc-link={heading.slug}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  </nav>
)}

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const tocLinks = document.querySelectorAll("[data-toc-link]");
    if (tocLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach((link) => {
              const isActive = link.getAttribute("data-toc-link") === id;
              link.classList.toggle("text-primary-600", isActive);
              link.classList.toggle("border-primary-500", isActive);
              link.classList.toggle("font-medium", isActive);
              link.classList.toggle("text-gray-500", !isActive);
              link.classList.toggle("border-transparent", !isActive);
            });
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    // Observe all headings referenced in ToC
    tocLinks.forEach((link) => {
      const id = link.getAttribute("data-toc-link");
      const heading = document.getElementById(id!);
      if (heading) observer.observe(heading);
    });
  });
</script>
```

**Step 2: Create SocialShare**

`packages/shared/src/components/SocialShare.astro`:

```astro
---
interface Props {
  url: string;
  title: string;
}

const { url, title } = Astro.props;
const encodedUrl = encodeURIComponent(url);
const encodedTitle = encodeURIComponent(title);
---

<div class="flex flex-col gap-2 mt-6" data-social-share>
  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Share</p>
  <a
    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    class="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
    aria-label="Share on LinkedIn"
  >
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  </a>
  <a
    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
    target="_blank"
    rel="noopener noreferrer"
    class="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
    aria-label="Share on X"
  >
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  </a>
  <a
    href={`mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`}
    class="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
    aria-label="Share via email"
  >
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>
  </a>
  <button
    type="button"
    class="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
    aria-label="Copy link"
    data-copy-url={url}
  >
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.939a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364l1.757 1.757"/></svg>
  </button>
</div>

<script>
  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("[data-copy-url]");
    if (!btn) return;
    const url = btn.getAttribute("data-copy-url");
    if (url) {
      navigator.clipboard.writeText(url);
      btn.classList.add("text-primary-600", "bg-primary-50");
      setTimeout(() => {
        btn.classList.remove("text-primary-600", "bg-primary-50");
      }, 2000);
    }
  });
</script>
```

**Step 3: Create ReadingProgressBar**

`packages/shared/src/components/ReadingProgressBar.astro`:

```astro
---
// No props needed — reads scroll position relative to [data-blog-content]
---

<div
  class="fixed top-0 left-0 right-0 z-[60] h-0.5 pointer-events-none"
  data-reading-progress
>
  <div
    class="h-full bg-primary-500 transition-[width] duration-100 ease-out"
    style="width: 0%"
    data-reading-progress-bar
  ></div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.querySelector("[data-reading-progress-bar]") as HTMLElement;
    const content = document.querySelector("[data-blog-content]") as HTMLElement;
    if (!bar || !content) return;

    function updateProgress() {
      const rect = content.getBoundingClientRect();
      const total = content.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / (total - window.innerHeight)) * 100);
      bar.style.width = `${pct}%`;
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  });
</script>
```

**Step 4: Create ImageLightbox**

`packages/shared/src/components/ImageLightbox.astro`:

```astro
---
// Attaches to all images inside [data-blog-content]
---

<div
  class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
  data-lightbox-overlay
>
  <img class="max-w-full max-h-[90vh] rounded-xl object-contain" data-lightbox-img />
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector("[data-lightbox-overlay]") as HTMLElement;
    const lightboxImg = document.querySelector("[data-lightbox-img]") as HTMLImageElement;
    if (!overlay || !lightboxImg) return;

    const content = document.querySelector("[data-blog-content]");
    if (!content) return;

    content.querySelectorAll("img").forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        overlay.classList.remove("hidden");
        overlay.classList.add("flex");
      });
    });

    overlay.addEventListener("click", () => {
      overlay.classList.add("hidden");
      overlay.classList.remove("flex");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        overlay.classList.add("hidden");
        overlay.classList.remove("flex");
      }
    });
  });
</script>
```

**Step 5: Build and verify**

```bash
cd /Users/abedearmer/Projects/growthgear-network && pnpm run build
```

Expected: Build succeeds (components not yet used, but should have no syntax errors).

**Step 6: Commit**

```bash
git add packages/shared/src/components/StickyToc.astro packages/shared/src/components/SocialShare.astro packages/shared/src/components/ReadingProgressBar.astro packages/shared/src/components/ImageLightbox.astro
git commit -m "feat: add StickyToc, SocialShare, ReadingProgressBar, ImageLightbox components"
```

---

## Task 5: Rewrite ArticleLayout.astro with 3-column sticky layout

The current `ArticleLayout.astro` is duplicated in each site. Since all 3 are identical, keep modifying the per-site layouts but apply the same changes to all 3.

**Files:**
- Modify: `sites/ai/src/layouts/ArticleLayout.astro`
- Modify: `sites/sales/src/layouts/ArticleLayout.astro`
- Modify: `sites/marketing/src/layouts/ArticleLayout.astro`

**Step 1: Rewrite all 3 ArticleLayout.astro files**

All 3 files should be identical except for the import of `config.ts` (which is site-specific). Here is the template — apply to all 3:

```astro
---
import "@growthgear/shared/styles";
import BaseHead from "@growthgear/shared/components/BaseHead.astro";
import Header from "@growthgear/shared/components/Header.astro";
import Footer from "@growthgear/shared/components/Footer.astro";
import SEO from "@growthgear/shared/components/SEO.astro";
import Breadcrumbs from "@growthgear/shared/components/Breadcrumbs.astro";
import StickyToc from "@growthgear/shared/components/StickyToc.astro";
import SocialShare from "@growthgear/shared/components/SocialShare.astro";
import ReadingProgressBar from "@growthgear/shared/components/ReadingProgressBar.astro";
import ImageLightbox from "@growthgear/shared/components/ImageLightbox.astro";
import FAQ from "@growthgear/shared/components/FAQ.astro";
import FloatingCTA from "@growthgear/shared/components/FloatingCTA.astro";
import { formatDate, readingTime, countWords } from "@growthgear/shared/utils";
import type { SEOData, Article } from "@growthgear/shared/types";
import { siteConfig, categories } from "../config";
import type { CollectionEntry } from "astro:content";

interface Props {
  article: CollectionEntry<"articles">;
  headings: { depth: number; slug: string; text: string }[];
}

const { article, headings } = Astro.props;
const { data, body } = article;
const { site, navigation, footer } = siteConfig;

const wordCount = countWords(body);
const readTime = readingTime(wordCount);

const category = categories.find((c) => c.slug === data.category);

const seo: SEOData = {
  title: `${data.title} | ${site.name}`,
  description: data.description,
  type: "article",
  image: data.image?.src,
  publishedTime: data.publishedAt.toISOString(),
  modifiedTime: data.updatedAt?.toISOString(),
  author: data.author.name,
  tags: data.tags,
};

const breadcrumbs = [
  { name: category?.name || data.category, href: `/${data.category}` },
  { name: data.title, href: `/${data.category}/${article.slug}` },
];

const articleUrl = `${siteConfig.seo.siteUrl}/${data.category}/${article.slug}`;

const articleData: Article = {
  slug: article.slug,
  title: data.title,
  description: data.description,
  content: body,
  category: data.category,
  author: data.author,
  publishedAt: data.publishedAt,
  updatedAt: data.updatedAt,
  image: data.image,
  tags: data.tags,
  readingTime: readTime,
  wordCount,
  faq: data.faq,
};
---

<!doctype html>
<html lang="en" data-theme={site.theme}>
  <BaseHead
    seo={seo}
    siteUrl={siteConfig.seo.siteUrl}
    siteName={site.name}
    theme={site.theme}
    gaId="G-J074S1C3E6"
  >
    <meta name="google-site-verification" content="nb5dmW4sSNMKYoWV6jZQPllrd95gJlmHm4JLYsUYLbE" />
  </BaseHead>
  <body class="min-h-screen flex flex-col">
    <ReadingProgressBar />
    <Header siteName={site.name} navigation={navigation} />
    <main class="flex-1">
      <!-- Article Header -->
      <div class="container-wide py-12 pb-0">
        <Breadcrumbs items={breadcrumbs} />

        <header class="mb-8 max-w-3xl">
          {category && (
            <a
              href={`/${data.category}`}
              class="text-sm font-semibold uppercase tracking-wide text-primary-600 hover:text-primary-800"
            >
              {category.name}
            </a>
          )}
          <h1 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            {data.title}
          </h1>
          <p class="mt-4 text-lg text-gray-600">{data.description}</p>

          <div class="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <div class="flex items-center gap-2">
              {data.author.avatar && (
                <img
                  src={data.author.avatar}
                  alt={data.author.name}
                  class="w-8 h-8 rounded-full"
                />
              )}
              <span>{data.author.name}</span>
            </div>
            <span class="text-gray-300">&bull;</span>
            <time datetime={data.publishedAt.toISOString()}>
              {formatDate(data.publishedAt)}
            </time>
            <span class="text-gray-300">&bull;</span>
            <span>{readTime} min read</span>
          </div>
        </header>

        {data.image && (
          <figure class="mb-8">
            <img
              src={data.image.src}
              alt={data.image.alt}
              class="w-full rounded-xl"
              loading="eager"
            />
          </figure>
        )}
      </div>

      <!-- 3-column layout: Sticky ToC | Article | Sticky CTA -->
      <div class="container-wide pb-12">
        <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_240px] gap-8 lg:gap-10">
          <!-- Left sidebar: Sticky ToC + Social Share (hidden on mobile) -->
          <aside class="hidden lg:block">
            <div class="sticky top-20">
              <StickyToc headings={headings} />
              <SocialShare url={articleUrl} title={data.title} />
            </div>
          </aside>

          <!-- Article content -->
          <article>
            <div class="prose prose-lg max-w-none" data-blog-content>
              <slot />
            </div>

            {data.faq && data.faq.length > 0 && <FAQ items={data.faq} />}
          </article>

          <!-- Right sidebar: Sticky CTA (hidden on mobile + tablet) -->
          <aside class="hidden xl:block">
            <div class="sticky top-20">
              <FloatingCTA />
            </div>
          </aside>
        </div>

        <!-- Mobile CTA (shown below article on smaller screens) -->
        <div class="mt-12 xl:hidden">
          <FloatingCTA />
        </div>
      </div>
    </main>
    <Footer siteName={site.name} links={footer.links} social={footer.social} />
    <SEO
      type="article"
      siteUrl={siteConfig.seo.siteUrl}
      siteName={site.name}
      article={articleData}
      breadcrumbs={breadcrumbs}
      faq={data.faq}
    />
    <ImageLightbox />
  </body>
</html>
```

**Step 2: Build all 3 sites**

```bash
cd /Users/abedearmer/Projects/growthgear-network && pnpm run build
```

Expected: All 3 sites build. Articles now render in 3-column layout with sticky ToC on the left.

**Step 3: Commit**

```bash
git add sites/ai/src/layouts/ArticleLayout.astro sites/sales/src/layouts/ArticleLayout.astro sites/marketing/src/layouts/ArticleLayout.astro
git commit -m "feat: rewrite ArticleLayout with 3-column sticky layout, progress bar, social share"
```

---

## Task 6: Redesign listing pages (index.astro for all 3 sites)

Replace the current Featured + Recent Articles layout with: Latest Post + Editor's Picks hero, mid-page CTA, search + category filters, article grid with newsletter card.

**Files:**
- Modify: `sites/ai/src/pages/index.astro`
- Modify: `sites/sales/src/pages/index.astro`
- Modify: `sites/marketing/src/pages/index.astro`

All 3 are structurally identical (only hero text and CTA copy differ). Each site already has different hero copy in the current version.

**Step 1: Rewrite index.astro for AI site**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ArticleCard from "@growthgear/shared/components/ArticleCard.astro";
import { getCollection } from "astro:content";
import { readingTime, countWords } from "@growthgear/shared/utils";
import { siteConfig, categories } from "../config";

const articles = await getCollection("articles");
const sortedArticles = articles.sort(
  (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
);

const featuredArticle = sortedArticles[0];
const editorPicks = sortedArticles.slice(1, 4);
const remainingArticles = sortedArticles.slice(4);
---

<BaseLayout
  seo={{
    title: `${siteConfig.site.name} - ${siteConfig.seo.defaultDescription}`,
    description: siteConfig.seo.defaultDescription,
  }}
>
  <!-- Hero -->
  <section class="bg-gradient-to-br from-primary-50 to-accent-50 py-16 md:py-24">
    <div class="container-wide">
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
          Expert Insights on
          <span class="text-primary-600">Artificial Intelligence</span>
        </h1>
        <p class="mt-6 text-xl text-gray-600">
          Stay ahead with actionable advice, in-depth guides, and the latest
          trends in AI, machine learning, and intelligent systems.
        </p>
      </div>
    </div>
  </section>

  <!-- Latest Post + Editor's Picks -->
  <section class="container-wide py-12">
    <div class="grid lg:grid-cols-2 gap-10">
      <!-- Latest Post -->
      {featuredArticle && (
        <div>
          <span class="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-5 block">
            Latest Post
          </span>
          <a href={`/${featuredArticle.data.category}/${featuredArticle.slug}`} class="group block">
            {featuredArticle.data.image ? (
              <div class="aspect-[16/9] rounded-xl overflow-hidden mb-5">
                <img
                  src={featuredArticle.data.image.src}
                  alt={featuredArticle.data.image.alt}
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="eager"
                />
              </div>
            ) : (
              <div class="aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-accent-600 mb-5" />
            )}
            <span class="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              {categories.find((c) => c.slug === featuredArticle.data.category)?.name}
            </span>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-3 group-hover:text-primary-600 transition-colors">
              {featuredArticle.data.title}
            </h2>
            <p class="text-gray-500 leading-relaxed mb-4 line-clamp-2">
              {featuredArticle.data.description}
            </p>
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <span class="font-medium text-gray-600">By {featuredArticle.data.author.name}</span>
              <span>&bull;</span>
              <span>{readingTime(countWords(featuredArticle.body))} min read</span>
            </div>
          </a>
        </div>
      )}

      <!-- Editor's Picks -->
      <div>
        <span class="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-5 block">
          Editor's Picks
        </span>
        <div class="space-y-5">
          {editorPicks.map((post) => (
            <a
              href={`/${post.data.category}/${post.slug}`}
              class="flex gap-5 group"
            >
              {post.data.image ? (
                <div class="w-36 h-24 shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={post.data.image.src}
                    alt={post.data.image.alt}
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div class="w-36 h-24 shrink-0 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600" />
              )}
              <div class="flex flex-col justify-center min-w-0">
                <span class="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
                  {categories.find((c) => c.slug === post.data.category)?.name}
                </span>
                <h3 class="text-base font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                  {post.data.title}
                </h3>
                <div class="flex items-center gap-2 text-xs text-gray-400 mt-1.5">
                  <span class="font-medium text-gray-500">By {post.data.author.name}</span>
                  <span>&bull;</span>
                  <span>{readingTime(countWords(post.body))} min read</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>

  <!-- Mid-page CTA -->
  <div class="container-wide mb-12">
    <div class="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 md:p-10 text-center">
      <h3 class="text-xl md:text-2xl font-bold text-white mb-3">
        Ready to Transform Your Business with AI?
      </h3>
      <p class="text-white/80 mb-6 max-w-lg mx-auto">
        Book a free strategy call and get a personalised AI implementation roadmap for your business.
      </p>
      <a
        href="#"
        onclick="Calendly.initPopupWidget({url: 'https://calendly.com/abe-growthgear/free-strategy-call?hide_gdpr_banner=1'});return false;"
        class="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-primary-700 px-8 py-3 font-semibold rounded-lg transition-all hover:scale-105 cursor-pointer"
      >
        Book Free Strategy Call
      </a>
    </div>
  </div>

  <!-- Category Filter + Search -->
  <div class="container-wide">
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-b border-gray-200 py-5 mb-10">
      <div class="flex flex-wrap gap-2" id="category-filters">
        <button
          class="category-btn active px-4 py-1.5 rounded-full text-sm font-medium transition-colors bg-primary-500 text-white"
          data-category="all"
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            class="category-btn px-4 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
            data-category={cat.slug}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div class="relative w-full sm:w-64">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          placeholder="Search articles..."
          id="search-input"
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-colors"
        />
      </div>
    </div>
  </div>

  <!-- Article Grid -->
  <section class="container-wide pb-16">
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" id="article-grid">
      {remainingArticles.map((article) => (
        <div
          data-article-card
          data-category={article.data.category}
          data-title={article.data.title.toLowerCase()}
          data-description={article.data.description.toLowerCase()}
        >
          <ArticleCard
            title={article.data.title}
            description={article.data.description}
            href={`/${article.data.category}/${article.slug}`}
            image={article.data.image}
            date={article.data.publishedAt}
            category={categories.find((c) => c.slug === article.data.category)?.name}
            categoryHref={`/${article.data.category}`}
            readingTime={readingTime(countWords(article.body))}
          />
        </div>
      ))}

      <!-- Newsletter Card -->
      <div class="bg-gray-900 rounded-xl p-8 flex flex-col justify-center text-center sm:text-left" data-newsletter-card>
        <h3 class="text-xl font-bold text-white mb-2">Stay in the loop</h3>
        <p class="text-sm text-gray-400 mb-5 leading-relaxed">
          Get the latest AI insights and productivity tips delivered to your inbox. No spam, just actionable advice.
        </p>
        <div class="flex gap-2">
          <input
            type="email"
            placeholder="Your email"
            class="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
          />
          <button class="shrink-0 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div class="hidden text-center py-16" id="no-results">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <p class="text-gray-500 text-lg font-medium">No articles found</p>
      <p class="text-gray-400 text-sm mt-1">Try adjusting your search or category filter.</p>
    </div>
  </section>

  <!-- Browse by Category -->
  <section class="bg-gray-50 py-16">
    <div class="container-wide">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <a
            href={`/${category.slug}`}
            class="group p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
          >
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600">
              {category.name}
            </h3>
            <p class="mt-2 text-sm text-gray-600">{category.description}</p>
          </a>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const filterBtns = document.querySelectorAll(".category-btn");
    const searchInput = document.getElementById("search-input") as HTMLInputElement;
    const cards = document.querySelectorAll("[data-article-card]");
    const newsletterCard = document.querySelector("[data-newsletter-card]");
    const noResults = document.getElementById("no-results");

    let activeCategory = "all";

    function filterArticles() {
      const query = searchInput?.value.toLowerCase().trim() || "";
      let visible = 0;

      cards.forEach((card) => {
        const cat = card.getAttribute("data-category") || "";
        const title = card.getAttribute("data-title") || "";
        const desc = card.getAttribute("data-description") || "";

        const matchesCat = activeCategory === "all" || cat === activeCategory;
        const matchesSearch = !query || title.includes(query) || desc.includes(query);

        const show = matchesCat && matchesSearch;
        (card as HTMLElement).style.display = show ? "" : "none";
        if (show) visible++;
      });

      // Show/hide newsletter card and empty state
      if (newsletterCard) (newsletterCard as HTMLElement).style.display = visible > 0 ? "" : "none";
      if (noResults) noResults.classList.toggle("hidden", visible > 0);
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => {
          b.classList.remove("bg-primary-500", "text-white", "active");
          b.classList.add("bg-gray-100", "text-gray-600");
        });
        btn.classList.add("bg-primary-500", "text-white", "active");
        btn.classList.remove("bg-gray-100", "text-gray-600");
        activeCategory = btn.getAttribute("data-category") || "all";
        filterArticles();
      });
    });

    searchInput?.addEventListener("input", filterArticles);
  });
</script>
```

**Step 2: Apply same pattern to Sales and Marketing**

Copy the AI version and change:
- **Sales** (`sites/sales/src/pages/index.astro`):
  - Hero title: `Master the Art of <span class="text-primary-600">Sales Excellence</span>`
  - Hero description: `Proven strategies, techniques, and insights to close more deals, build stronger relationships, and accelerate your sales career.`
  - CTA: `Ready to Supercharge Your Sales?` / `Book a free strategy call and discover how AI-powered tools can help you close more deals.`
  - Newsletter: `Get the latest sales insights and strategies...`

- **Marketing** (`sites/marketing/src/pages/index.astro`):
  - Hero title: `Your Edge in <span class="text-primary-600">Digital Marketing</span>`
  - Hero description: `Cutting-edge strategies, growth hacks, and actionable insights to scale your marketing and drive real business results.`
  - CTA: `Ready to Scale Your Marketing?` / `Book a free strategy call and learn how AI can amplify your marketing results.`
  - Newsletter: `Get the latest marketing insights and growth tips...`

**Step 3: Build all 3 sites**

```bash
cd /Users/abedearmer/Projects/growthgear-network && pnpm run build
```

Expected: All 3 listing pages now have Latest Post + Editor's Picks + mid-page CTA + filters + newsletter.

**Step 4: Commit**

```bash
git add sites/ai/src/pages/index.astro sites/sales/src/pages/index.astro sites/marketing/src/pages/index.astro
git commit -m "feat: redesign listing pages with hero, mid-page CTA, search, filters, newsletter"
```

---

## Task 7: Migrate all 36 articles from .md to .mdx with rich components

Convert all articles from `.md` to `.mdx` and add KeyTakeaways, Callout, InlineCTA, and FAQ components. The articles already have FAQ data in frontmatter — we keep that but also add inline components for richer content.

**Files:**
- Rename + modify: All 36 `.md` files in `sites/*/src/content/articles/` to `.mdx`

**Strategy:** For each article:
1. Rename `.md` -> `.mdx`
2. Add component imports at the top (after frontmatter closing `---`)
3. Add `<KeyTakeaways>` after the opening paragraph
4. Add `<InlineCTA />` roughly in the middle of the article
5. Add 1-2 `<Callout>` boxes at relevant points
6. Keep existing FAQ in frontmatter (the FAQ component already reads from there)

**Step 1: Create a migration script**

Create `scripts/migrate-to-mdx.ts` that automates the bulk of the work:

```typescript
import fs from "fs/promises";
import path from "path";

const SITES = ["ai", "sales", "marketing"];
const ROOT = path.resolve(import.meta.dirname, "..");

for (const site of SITES) {
  const articlesDir = path.join(ROOT, "sites", site, "src", "content", "articles");
  const files = await fs.readdir(articlesDir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  for (const file of mdFiles) {
    const oldPath = path.join(articlesDir, file);
    const newPath = path.join(articlesDir, file.replace(/\.md$/, ".mdx"));
    const content = await fs.readFile(oldPath, "utf-8");

    // Split frontmatter and body
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) {
      console.log(`  Skipping ${file} (no frontmatter)`);
      continue;
    }

    const frontmatter = fmMatch[1];
    const body = fmMatch[2].trim();

    // Split body into paragraphs/sections at ## headings
    const sections = body.split(/(?=^## )/m);
    const totalSections = sections.length;

    // Insert InlineCTA at ~40% through the article
    const ctaIndex = Math.max(1, Math.floor(totalSections * 0.4));

    // Build the key takeaways from first few bullet points or section headers
    const h2s = body.match(/^## .+$/gm) || [];
    const takeawayPoints = h2s.slice(0, 5).map((h) =>
      h.replace(/^## /, "").trim()
    );

    // Component imports
    const imports = `import KeyTakeaways from "@growthgear/shared/components/KeyTakeaways.astro";
import Callout from "@growthgear/shared/components/Callout.astro";
import InlineCTA from "@growthgear/shared/components/InlineCTA.astro";`;

    // Build KeyTakeaways
    const takeaways = takeawayPoints.length > 0
      ? `\n<KeyTakeaways items={${JSON.stringify(takeawayPoints)}} />\n`
      : "";

    // Reassemble with components injected
    const newSections = [...sections];
    if (ctaIndex < newSections.length) {
      newSections.splice(ctaIndex, 0, "\n<InlineCTA />\n");
    }

    const newBody = newSections.join("\n");
    const mdxContent = `---\n${frontmatter}\n---\n\n${imports}\n${takeaways}\n${newBody}\n`;

    await fs.writeFile(newPath, mdxContent, "utf-8");
    await fs.unlink(oldPath);
    console.log(`  Migrated: ${file} -> ${file.replace(".md", ".mdx")}`);
  }
}

console.log("Migration complete!");
```

**Step 2: Run the migration**

```bash
cd /Users/abedearmer/Projects/growthgear-network
npx tsx scripts/migrate-to-mdx.ts
```

Expected: All 36 `.md` files become `.mdx` files with component imports and KeyTakeaways/InlineCTA injected.

**Step 3: Manually review and refine a few articles**

After the automated migration, open 2-3 articles per site and:
- Verify the KeyTakeaways items make sense (edit if the auto-extracted H2s aren't great)
- Add a `<Callout>` box around an important tip or warning in the content
- Verify the InlineCTA placement looks natural

**Step 4: Build all 3 sites**

```bash
pnpm run build
```

Expected: All 36 articles build as `.mdx` with components rendered. Fix any build errors (common: unescaped `{` or `<` in markdown that MDX interprets as JSX).

**IMPORTANT:** MDX is stricter than markdown. Watch for:
- Curly braces `{}` in article text — must be escaped as `\{` `\}`
- Angle brackets `<` in text — must be escaped as `&lt;`
- HTML comments `<!-- -->` — not allowed in MDX, remove them

**Step 5: Commit**

```bash
git add sites/*/src/content/articles/ scripts/migrate-to-mdx.ts
git commit -m "feat: migrate all 36 articles from .md to .mdx with rich components"
```

---

## Task 8: Update sync scripts to output .mdx

The blog agents write `.md` files via `sync-articles.ts`. Update them to output `.mdx` with component imports.

**Files:**
- Modify: `sites/ai/scripts/sync-articles.ts`
- Modify: `sites/sales/scripts/sync-articles.ts`
- Modify: `sites/marketing/scripts/sync-articles.ts`

**Step 1: Update sync script for AI (and identically for sales, marketing)**

In each sync script, change the file output section. Find the line:

```typescript
const filename = `${article.slug}.md`;
```

Change to:

```typescript
const filename = `${article.slug}.mdx`;
```

And update the content template to include component imports. Find where `frontmatter` and `markdown` are assembled and add imports after the frontmatter:

```typescript
const imports = `import KeyTakeaways from "@growthgear/shared/components/KeyTakeaways.astro";
import Callout from "@growthgear/shared/components/Callout.astro";
import InlineCTA from "@growthgear/shared/components/InlineCTA.astro";`;

const markdown = `${frontmatter}

${imports}

${article.content}
`;
```

**Note:** The blog agents themselves (on the Mac Mini) will also need updating to generate `.mdx` with components. That's a separate task outside this plan (updating the agent prompt/scripts at `/Volumes/dearmer-mcp/projects/`).

**Step 2: Build to verify**

```bash
pnpm run build
```

**Step 3: Commit**

```bash
git add sites/*/scripts/sync-articles.ts
git commit -m "feat: update sync scripts to output .mdx with component imports"
```

---

## Task 9: Add CollectionPage JSON-LD to listing pages

The article pages already have Article + Breadcrumb + FAQ JSON-LD. Add CollectionPage schema to the listing index pages for better search engine understanding.

**Files:**
- Modify: `sites/ai/src/pages/index.astro` (and sales, marketing)
- Modify: `packages/shared/src/components/SEO.astro`

**Step 1: Add CollectionPage support to SEO component**

In `packages/shared/src/components/SEO.astro`, add a `collectionPage` prop:

Add to the Props interface:
```typescript
interface Props {
  type: "website" | "article" | "faq" | "collection";
  // ... existing props
  collectionArticles?: { title: string; url: string; description: string }[];
}
```

Add after the existing FAQ schema:

```typescript
const collectionSchema = type === "collection" && Astro.props.collectionArticles?.length
  ? {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: Astro.props.seo?.title || siteName,
      url: currentUrl,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: Astro.props.collectionArticles.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: a.url,
          name: a.title,
        })),
      },
    }
  : null;
```

Add render block:
```astro
{collectionSchema && (
  <script type="application/ld+json" set:html={JSON.stringify(collectionSchema)} />
)}
```

**Step 2: Use CollectionPage schema in listing pages**

In each site's `index.astro`, the `BaseLayout` already accepts `seo` props. Update the SEO component call to pass collection data. Since `BaseLayout` renders `<SEO type="website" .../>`, you'll need to either:
- Change BaseLayout to accept a `seoType` prop, OR
- Add an inline `<script type="application/ld+json">` in the index page directly

The simplest approach — add the JSON-LD inline in the `index.astro` pages after the closing `</BaseLayout>` (Astro allows this):

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${siteConfig.site.name} - Articles`,
  url: siteConfig.seo.siteUrl,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: sortedArticles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.seo.siteUrl}/${a.data.category}/${a.slug}`,
      name: a.data.title,
    })),
  },
})} />
```

Add this just before `</BaseLayout>` in each site's `index.astro`.

**Step 3: Build and verify**

```bash
pnpm run build
```

Check the built HTML for the JSON-LD:
```bash
grep -l "CollectionPage" sites/ai/dist/index.html
```

**Step 4: Commit**

```bash
git add sites/*/src/pages/index.astro packages/shared/src/components/SEO.astro
git commit -m "feat: add CollectionPage JSON-LD schema to listing pages"
```

---

## Task 10: Visual QA and build verification

**Step 1: Build all sites**

```bash
cd /Users/abedearmer/Projects/growthgear-network && pnpm run build
```

Expected: 0 errors, all pages generated.

**Step 2: Preview AI site locally**

```bash
cd sites/ai && pnpm run preview
```

Open `http://localhost:4321/` and verify:
- [ ] Listing page: Latest Post + Editor's Picks hero with images
- [ ] Mid-page CTA with Calendly button
- [ ] Category filter buttons work (client-side filtering)
- [ ] Search bar filters articles
- [ ] Newsletter signup card in grid
- [ ] Browse by Category section

Open an article page and verify:
- [ ] Reading progress bar at top
- [ ] 3-column layout: Sticky ToC (left), Article (center), Sticky CTA (right)
- [ ] ToC highlights active heading on scroll
- [ ] Social share buttons (LinkedIn, X, email, copy link)
- [ ] KeyTakeaways box with checkmark items
- [ ] InlineCTA box mid-article
- [ ] FAQ accordion: all answers visible initially, collapses after page load
- [ ] Image lightbox on click
- [ ] Responsive: check mobile (ToC and right CTA hidden, mobile CTA shown below)

**Step 3: Spot-check Sales and Marketing sites**

```bash
cd sites/sales && pnpm run preview  # port 4322
cd sites/marketing && pnpm run preview  # port 4323
```

Verify theme colors are correct:
- AI: purple/blue
- Sales: navy/gold
- Marketing: teal/coral

**Step 4: Fix any issues found**

Common issues to watch for:
- Tailwind classes using `primary-*` or `accent-*` not applying — check CSS variable definitions
- `prose` class overriding component styles — use `not-prose` on components that need it
- MDX build errors from unescaped characters in article content

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: visual QA fixes for blog redesign"
```

---

## Task 11: Deploy to Cloudflare Pages

**Step 1: Push to GitHub**

```bash
cd /Users/abedearmer/Projects/growthgear-network
git push origin main
```

**Step 2: Trigger deployment**

```bash
gh workflow dispatch deploy-sites.yml -f site=all -f skip_sync=true
```

The `skip_sync=true` flag prevents the workflow from overwriting our `.mdx` files with the old `.md` format from the API.

**Step 3: Verify deployment**

Check the GitHub Actions run:
```bash
gh run list --workflow=deploy-sites.yml -L 1
gh run view <run-id> --log
```

Once deployed, verify in browser:
- https://ai.growthgear.com.au/
- https://sales.growthgear.com.au/
- https://marketing.growthgear.com.au/

**Step 4: Final commit (if any deploy fixes needed)**

---

## Task 12: Update blog agents to write .mdx

The 3 blog agents on the Mac Mini need updating to write `.mdx` files instead of `.md` and include rich components. This involves updating the agent prompts/scripts at:
- `/Volumes/dearmer-mcp/projects/GrowthGear-AI-Blog-Agent/` (or wherever they live)
- Similar paths for Sales and Marketing blog agents

**What to change in each agent:**
1. File extension: `.md` -> `.mdx`
2. Add component imports after frontmatter
3. Instruct the agent prompt to include `<KeyTakeaways>`, `<Callout>`, and `<InlineCTA />` in generated content
4. Ensure the agent escapes curly braces `{}` and angle brackets `<` in prose text

**Note:** The Mac Mini volume must be mounted to make these changes. If not accessible, defer to a separate session.
