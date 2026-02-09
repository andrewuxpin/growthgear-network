# GrowthGear Network - Claude Context

## Project Overview
Monorepo for GrowthGear marketing sites and API workers, built with Astro (sites) and Cloudflare Workers (API).

**Location:** `/Users/andrew/growthgear-network/`

## Architecture

### Sites (Astro + Cloudflare Pages)
| Site | ID | URL |
|------|-----|-----|
| AI | `ai` | https://ai.growthgear.com.au |
| Sales | `sales` | https://sales.growthgear.com.au |
| Marketing | `marketing` | https://marketing.growthgear.com.au |
| Hub | `hub` | https://hub.growthgear.com.au |

Each site has:
- `src/pages/` - Astro pages
- `src/layouts/` - Layout components
- `src/config.ts` - Site config with `siteConfig.site.id`

### Workers (Cloudflare Workers)
| Worker | Purpose |
|--------|---------|
| `workers/api` | Main API (growthgear-api.andrew-705.workers.dev) |
| `workers/content-scheduler` | Content scheduling |
| `workers/keyword-generator` | Keyword generation |
| `workers/content-refresher` | Content refresh |

### API Worker Bindings (`workers/api/wrangler.toml`)
- **D1 Database:** `DB` → `growthgear-db` (ID: 0feac72f-0900-4c99-8d3b-65f9b550ac1d)
- **R2 Bucket:** `IMAGES` → `growthgear-images`
- **AI:** Cloudflare AI binding
- **Secrets:** `ANTHROPIC_API_KEY`, `ADMIN_API_KEY`, `GITHUB_TOKEN`, `RESEND_API_KEY`

### Database (D1)
Migrations in `database/migrations/`:
- `001_add_page_views.sql` - Analytics tracking
- `002_add_article_category.sql` - Article categories
- `003_add_contact_submissions.sql` - Contact form submissions

## Contact Form Implementation (Feb 2026)

### What was built
1. **API Endpoint:** `POST /api/public/contact` (no auth required)
   - Validates required fields (site_id, name, email, subject, message)
   - Stores submission in `contact_submissions` D1 table
   - Sends email notification via Resend to marketing@growthgear.com.au

2. **Frontend:** Updated all 4 `sites/*/src/pages/contact.astro` files
   - Added `marketing@growthgear.com.au` mailto link in sidebar
   - Added JavaScript form submission to API
   - Added success/error feedback messages

3. **Email:** Resend integration
   - Account: marketing@growthgear.com.au
   - Sends from: `onboarding@resend.dev` (no domain verification needed)
   - API key stored as `RESEND_API_KEY` secret

### Key code locations
- API handler: `workers/api/src/index.ts` → `handleContactSubmission()` (~line 722)
- Contact pages: `sites/*/src/pages/contact.astro`
- Migration: `database/migrations/003_add_contact_submissions.sql`

### Deployment commands
```bash
# Deploy API worker
cd workers/api && npx wrangler deploy

# Run D1 migration
npx wrangler d1 execute growthgear-db --remote --file=database/migrations/XXX.sql

# Query contact submissions
npx wrangler d1 execute growthgear-db --remote --command="SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 10"

# Update a secret
echo "value" | npx wrangler secret put SECRET_NAME --name growthgear-api

# Trigger site deploy (via GitHub API)
curl -X POST "https://api.github.com/repos/andrewuxpin/growthgear-network/actions/workflows/deploy-sites.yml/dispatches" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"ref":"main","inputs":{"site":"ai"}}'
```

## DNS / Hosting
- **Domain registrar:** GoDaddy (nameservers: ns51/ns52.domaincontrol.com)
- **Sites hosting:** Cloudflare Pages
- **Workers hosting:** Cloudflare Workers
- **GitHub repo:** andrewuxpin/growthgear-network
