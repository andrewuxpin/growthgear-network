# GrowthGear Network

A multi-site SEO content platform built with Astro, TypeScript, and Cloudflare.

## Overview

GrowthGear Network is a collection of AI-powered niche content sites designed for building domain authority and driving organic traffic. The network uses a monorepo architecture with shared components across all sites.

### Sites

- **AI Insights** (`sites/ai`) - Artificial intelligence and machine learning content
- **Sales Hub** (`sites/sales`) - B2B sales strategies (coming soon)
- **Marketing Hub** (`sites/marketing`) - Digital marketing insights (coming soon)
- **GrowthGear Hub** (`sites/hub`) - Central hub site (coming soon)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 4.x |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS |
| Database | Cloudflare D1 |
| Storage | Cloudflare R2 |
| Hosting | Cloudflare Pages |
| Automation | Cloudflare Workers |
| AI Content | Claude API |
| Monorepo | Turborepo + pnpm |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd growthgear-network

# Install dependencies
pnpm install
```

### Development

```bash
# Start all sites in development mode
pnpm dev

# Start a specific site
pnpm dev --filter=@growthgear/ai-site

# Build all sites
pnpm build

# Build a specific site
pnpm build --filter=@growthgear/ai-site
```

### Project Structure

```
growthgear-network/
├── packages/
│   ├── shared/              # Shared components, utilities, types
│   ├── content-engine/      # Claude content generation (Phase 2)
│   ├── admin-dashboard/     # Admin interface (Phase 2)
│   └── customer-portal/     # Customer dashboard (Phase 5)
├── sites/
│   ├── ai/                  # AI niche site
│   ├── sales/               # Sales niche site
│   ├── marketing/           # Marketing niche site
│   └── hub/                 # Central hub site
├── workers/
│   ├── content-scheduler/   # Cron job for content generation
│   ├── content-refresher/   # Cron job for content updates
│   └── api/                 # API routes
├── database/
│   └── schema.sql           # D1 database schema
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── PLAN.md                  # Implementation plan
```

## Shared Package

The `@growthgear/shared` package contains:

### Components

- `BaseHead.astro` - Meta tags, fonts, analytics
- `Header.astro` - Site navigation
- `Footer.astro` - Site footer
- `ArticleCard.astro` - Article preview card
- `SEO.astro` - JSON-LD structured data
- `TableOfContents.astro` - Auto-generated TOC
- `FAQ.astro` - FAQ section with schema
- `Breadcrumbs.astro` - Navigation breadcrumbs

### Utilities

```typescript
import { formatDate, slugify, readingTime, truncate } from "@growthgear/shared/utils";
```

### Types

```typescript
import type { Article, Category, Site, SEOData } from "@growthgear/shared/types";
```

### Theming

The shared package includes a TailwindCSS theme system with CSS variables for per-site customization:

- **AI Theme**: Purple (#7C3AED) + Electric Blue (#3B82F6)
- **Sales Theme**: Navy (#1E3A5F) + Gold (#F59E0B)
- **Marketing Theme**: Teal (#0D9488) + Coral (#F97316)
- **Hub Theme**: Neutral Gray (#374151) + Gradient accents

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

See `.env.example` for required variables.

## Deployment

Sites are deployed to Cloudflare Pages:

```bash
# Build for production
pnpm build --filter=@growthgear/ai-site

# Output is in sites/ai/dist
```

Configure Cloudflare Pages with:
- Build command: `pnpm build --filter=@growthgear/ai-site`
- Output directory: `sites/ai/dist`

## Contributing

1. Check `PLAN.md` for current tasks and status
2. Create a feature branch
3. Make changes following existing patterns
4. Ensure TypeScript passes: `pnpm typecheck`
5. Submit a pull request

## License

Private - All rights reserved.
