---
title: "What Is n8n Free? Community Edition Limits Explained"
description: "n8n free is the self-hosted Community Edition with unlimited executions and 400+ nodes. Learn what is included, the real hosting cost, and when free is enough."
category: "ai-tools"
author:
  name: "Abe Dearmer"
publishedAt: 2026-08-17
image:
  src: "/images/what-is-n8n-free-tier-guide.webp"
  alt: "n8n free Community Edition workflow nodes on blue and purple gradient canvas"
tags:
  - n8n
  - workflow-automation
  - free-tier
  - self-hosting
  - ai-tools
faq:
  - question: "Is n8n really free?"
    answer: "Yes. n8n Community Edition is free to self-host under n8n's sustainable-use license with no execution limits, no workflow caps, and no user-seat charges. The only cost is the server you run it on, typically $6-20/month for a VPS, plus your own setup and maintenance time."
  - question: "What is the difference between n8n free and n8n Cloud?"
    answer: "n8n free (Community Edition) is self-hosted, free to license, and has unlimited executions but requires you to manage your own server. n8n Cloud is fully managed by n8n and starts at about $20/month for 2,500 executions on the Starter plan, with no infrastructure to maintain."
  - question: "Does n8n free have execution limits?"
    answer: "No. The self-hosted Community Edition has no execution limits and no active-workflow caps. Execution limits only apply to n8n Cloud paid plans (2,500 on Starter, 10,000 on Pro). Free self-hosted n8n is bounded only by your server's CPU and memory."
  - question: "Can I use n8n free for commercial projects?"
    answer: "Yes. n8n's sustainable-use license permits most commercial use, including running production workflows for clients. The license restricts building a competing workflow-automation product from n8n's source, not running automations for your own business or customers."
  - question: "How many integrations does n8n free include?"
    answer: "n8n Community Edition includes the same 400+ official integrations as paid plans, plus an HTTP Request node for any REST API and code nodes for JavaScript and Python. There is no integration paywall between free self-hosted and paid tiers."
  - question: "Is n8n free open source?"
    answer: "n8n is source-available under a sustainable-use license, not a strict OSI open-source license. You can read, modify, and self-host the code for most commercial automation, but you cannot repackage n8n itself as a competing product."
  - question: "When should I upgrade from n8n free to a paid plan?"
    answer: "Upgrade when you lack DevOps capacity, need infrastructure SLAs, require SSO or audit logs, or want managed updates. Teams under 5,000 executions/month with technical staff typically save the most by staying self-hosted; teams without technical staff benefit most from Cloud."
keyTakeaways:
  - "n8n Community Edition is free to self-host with unlimited executions, unlimited workflows, and all 400+ integration nodes — the only hard limits are your server's CPU and memory."
  - "The real cost of free n8n is $6-20/month for a VPS plus 4-16 hours of initial setup and 1-2 hours of monthly maintenance — not zero, but far below Cloud Pro's $50/month."
  - "Free n8n uses a sustainable-use license, not strict OSI open source: commercial automation is allowed, repackaging n8n as a competing product is not."
  - "Free n8n is the right choice above roughly 15,000-20,000 executions/month, where Cloud overages or Enterprise pricing would cost hundreds of dollars more each month."
  - "There is no integration or node paywall between free self-hosted and paid Cloud — the same AI Agent, vector store, and code nodes ship in both."
callout:
  variant: "pro"
  title: "Run Free n8n on a $6 VPS First"
  content: "Validate your workflows on a $6/month Hetzner VPS before scaling. Most teams under 5,000 executions/month never need more, and the setup cost is a single afternoon."
---

n8n free is the self-hosted Community Edition of the n8n workflow-automation platform, available at $0 license cost under n8n's sustainable-use license. You get the full node library, unlimited executions, and no active-workflow caps — the only limits are the server you run it on and the time you spend maintaining it. For teams evaluating automation tooling, the question is rarely whether n8n is free, but whether free n8n is enough.

This guide breaks down exactly what the n8n free tier includes, what it omits, what it genuinely costs to run, and how to decide between free self-hosting and n8n's paid Cloud plans. If you need the full cost-of-ownership comparison across every tier, our [n8n pricing guide](/ai-tools/n8n-pricing-cloud-vs-self-hosted-guide) covers Starter, Pro, and Enterprise in detail.

## What Is the n8n Free Tier?

The n8n free tier is the Community Edition — the self-hostable, license-free build of n8n that anyone can deploy on their own infrastructure. It ships with the complete node library and removes the execution limits that define n8n's paid Cloud plans. The trade-off is operational — you supply and maintain the server it runs on.

### n8n Community Edition Definition

**n8n Community Edition is the self-hosted build of n8n distributed at $0 license cost under n8n's sustainable-use license, with no execution limits, no workflow caps, and the full integration node library.** You download it from [n8n's GitHub repository](https://github.com/n8n-io/n8n) or the official Docker image, deploy it on your own VPS or container host, and own the infrastructure, upgrades, and backups.

What makes it "free" is the license, not the infrastructure. The Community Edition carries a $0 fee for most commercial automation use — running production workflows for your business or for clients is permitted. What the license restricts is repackaging n8n's source as a competing automation product, which is why n8n is technically "source-available" rather than OSI-certified open source. For the vast majority of automation teams, the distinction has no practical effect.

### Free Trial vs Free Community Edition

n8n offers two distinct "free" paths, and conflating them causes most of the confusion around the keyword "n8n free":

- **n8n Cloud free trial** — a 14-day evaluation of the managed Cloud platform on your own subdomain, with no infrastructure to set up. It expires, and there is no permanent free Cloud tier. After the trial you move to a paid Cloud plan or stop using Cloud.
- **n8n Community Edition** — the permanent, self-hosted, license-free build described above. It does not expire, has no execution limits, and is what "n8n free" almost always refers to in search and community discussion.

The 14-day Cloud trial is genuinely free in the sense that no credit card is required and you can build real workflows, but it is a time-limited evaluation of the managed product. The Community Edition is the durable free option. Teams that want managed infrastructure forever pay for Cloud; teams that want free forever self-host.

## What Is Included in n8n Community Edition?

The Community Edition includes the full n8n feature surface — the same visual editor, node library, AI capabilities, and code extensibility that paid Cloud plans use. There is no gated "premium nodes" layer between free self-hosted and paid Cloud. The differences between the two are operational (who manages the server) and commercial (execution-based billing vs. your own infrastructure costs).

### Nodes, Integrations, and AI Capabilities

According to [n8n's official documentation](https://docs.n8n.io/), the Community Edition ships with **400+ official integration nodes** covering the major SaaS apps — Slack, Gmail, HubSpot, Salesforce, Notion, Airtable, Stripe, Postgres, and most major databases and message queues. Beyond the official library, two extensibility mechanisms effectively remove any integration ceiling:

- **HTTP Request node** connects to any REST API without a dedicated node, letting you authenticate and call services n8n does not formally support.
- **Code nodes** for JavaScript and Python let you write arbitrary logic inline, so you can transform data, call libraries, and bridge gaps the visual nodes do not cover.

AI capabilities are not gated behind paid plans. The free self-hosted build includes the same **AI Agent node** that paid Cloud users get — it orchestrates multi-step LLM workflows with tools, memory, and chained reasoning, comparable to building an agent with LangChain. Native nodes connect to OpenAI, Anthropic, Google Vertex AI, Hugging Face, and self-hosted models via Ollama. Vector store nodes for Pinecone, Weaviate, Qdrant, Supabase, and Postgres pgvector make RAG pipelines a first-class workflow pattern. For teams building [AI automation](/ai-tools/how-to-use-ai-to-automate-tasks-complete-guide), free n8n is a capable backbone — the same one our [best n8n templates](/ai-tools/best-n8n-templates-ai-automation-workflows) guide builds on.

### What Free n8n Does Not Include

The Community Edition omits the managed and enterprise-grade features that justify n8n's paid tiers. Knowing the gaps up front prevents choosing free for the wrong reasons. Free self-hosted n8n does **not** include:

- **Managed infrastructure and SLAs** — you own uptime, backups, SSL renewal, and version upgrades. There is no n8n-side reliability guarantee, no automatic failover, and no monitored database service backing your workflow runs.
- **SSO, SAML, and advanced role-based access control** — single sign-on and granular permissions are Enterprise features. The Community Edition ships with basic username-password auth plus optional OAuth2 for external identity providers, but no native SAML or fine-grained team roles.
- **Audit logging and compliance exports** — the detailed execution and access logs required for regulated environments are gated to Enterprise. Community Edition keeps execution history for debugging, but not in the tamper-evident, exportable format compliance teams need.
- **Priority support and dedicated customer success** — community forum and GitHub issues are your support channels; there is no SLA-backed helpdesk and no dedicated account team for escalation.
- **One-click managed updates** — you apply version upgrades yourself, and n8n releases occasionally introduce breaking changes that require workflow fixes. Cloud plans handle this transparently.

The features that drive most teams to paid n8n are operational (managed hosting, SLAs) and compliance-related (SSO, audit logs), not workflow-power-related. A free self-hosted instance can run the exact same sophisticated AI pipeline as an Enterprise deployment — it just does not give you a team to call when the server is down.

## How Much Does Free n8n Actually Cost to Run?

"Free" n8n is license-free, not cost-free. The Community Edition carries a $0 software fee, but running it reliably in production requires infrastructure, setup time, and ongoing maintenance. Most "is n8n free?" comparisons stop at the $0 license line and hide these costs; a defensible decision needs the full total cost of ownership.

### Infrastructure Cost

The minimum viable self-hosted n8n deployment depends on execution volume. According to n8n's documentation and community-reported benchmarks, a sensible baseline is:

- **1 vCPU, 1GB RAM** — light automation under 500 executions/day with a SQLite database.
- **2 vCPU, 2GB RAM** — moderate use of 500-5,000 executions/day; PostgreSQL recommended.
- **4+ vCPU, 4GB RAM** — production workloads exceeding 5,000 executions/day.

Typical monthly VPS costs across major providers:

| Provider | 2 vCPU / 2GB RAM | 4 vCPU / 4GB RAM | Notes |
|---|---|---|---|
| Hetzner Cloud (EU) | ~$5/month | ~$10/month | Best price-to-performance for EU teams |
| DigitalOcean | ~$12/month | ~$24/month | Strong US/global coverage |
| AWS EC2 (t3.small) | ~$15/month | ~$30/month | Best for AWS-native stacks |
| Fly.io | ~$7/month | ~$14/month | Good for containerized deployments |
| Render | ~$7/month | ~$15/month | Managed containers, minimal ops overhead |

For most small teams, a **Hetzner or DigitalOcean VPS in the $6-12/month range** handles n8n comfortably. A production-grade setup also needs a PostgreSQL database — either bundled on the same server or $5-10/month on a managed database service. Realistic monthly infrastructure cost lands at **$10-25/month** for a reliable self-hosted n8n instance, which is the honest floor for "free" n8n.

### Setup and Maintenance Time

Infrastructure is the easy cost to calculate; developer time is where self-hosting estimates usually go wrong:

- **Initial setup**: 2-4 hours for a basic Docker deployment; 8-16 hours for production setup with SSL, automated backups, monitoring, and PostgreSQL.
- **Ongoing maintenance**: 1-2 hours/month for version updates, security patches, and routine troubleshooting.
- **Major incidents**: n8n version upgrades occasionally introduce breaking changes for existing workflows. Based on n8n's changelog history, this happens roughly 3-4 times per year and may require 1-2 hours of workflow fixes per event.

At a conservative $100/hour developer rate, initial setup costs $200-400, with $100-200/month in ongoing time investment. This is why our n8n pricing analysis concludes that self-hosting only becomes financially dominant above roughly 15,000-20,000 executions/month — below that, the Pro plan's $50/month is often cheaper once developer hours are counted.

> **Common mistake:** Don't compare $0 license cost to $50/month Cloud Pro without adding your infrastructure and time costs. A self-hosted instance that costs you 4 hours of setup and 2 hours of monthly maintenance is a real $400-600 of first-year cost, not zero.

## When Is n8n Free the Right Choice?

Neither deployment is universally better. Free self-hosted n8n is the right call when your automation volume, technical capacity, and data requirements make the operational overhead worthwhile. Below the threshold where developer time outweighs subscription savings, Cloud Pro is usually the better financial decision.

### Choose Free Self-Hosted n8n If...

Free n8n is the right choice when:

- **You process 20,000+ executions/month** — at this volume, self-hosting saves $200-500+/month versus Cloud Pro overages or Enterprise pricing, which quickly dwarfs infrastructure and time costs.
- **Data sovereignty is required** — healthcare, finance, and legal teams typically cannot send workflow data and execution logs to third-party cloud infrastructure. Self-hosting keeps data inside your perimeter, a requirement no Cloud plan satisfies without an Enterprise contract.
- **You have existing DevOps capacity** — adding n8n to an existing Kubernetes or Docker environment is marginal additional overhead, not a new operational burden. If you already run a server fleet, one more container is cheap.
- **You need unlimited workflows** — self-hosted n8n has no active-workflow caps, making it the right choice for large multi-process automation architectures that would blow past Cloud Pro's 15-workflow limit.
- **You serve multiple clients** — self-hosted Community Edition carries no per-client licensing, so agencies running automation for many customers avoid per-tenant Cloud subscriptions.

From a purely financial perspective, self-hosting becomes superior at roughly **15,000-20,000 executions/month** once realistic developer time is included. Below that threshold, Cloud Pro wins on total cost of ownership for most teams. When you pair free n8n with [CRM platforms](https://sales.growthgear.com.au/crm-tools/best-crm-software-small-business-teams) or [AI marketing automation tools](https://marketing.growthgear.com.au/content-marketing/best-ai-tools-digital-marketing-automation), the same self-hosted instance can power cross-functional pipelines without per-seat licensing stacking up.

### Choose a Paid n8n Plan If...

Paid n8n is the better fit when:

- **Your team lacks DevOps capacity** — Cloud eliminates all server management, which matters more than the subscription cost for teams without technical staff.
- **You run under 10,000 executions/month** — Cloud Pro at roughly $50/month is cheaper than developer time for self-hosting once setup costs are amortized, and far simpler to operate.
- **Uptime SLAs matter** — n8n Cloud provides infrastructure reliability guarantees that self-hosting cannot match without significant extra effort (redundancy, monitoring, failover).
- **You need SSO, audit logs, or role-based access** — these compliance features are Enterprise-gated and are not available on the Community Edition at any price.
- **You are still evaluating n8n** — the 14-day Cloud free trial lets you test real workflows without committing to infrastructure, which is the fastest path to a build-vs-buy decision.

> **Ready to build an AI automation stack?** GrowthGear's team has helped 50+ startups deploy self-hosted and cloud automation that drives measurable results. [Book a Free Strategy Session](https://growthgear.com.au) to map your n8n architecture and deployment model.

## n8n Free vs Paid Plans Compared

The decision between free self-hosted n8n and paid Cloud plans comes down to one trade-off: pay more money for managed infrastructure, or invest more time for license-free self-hosting. The comparison table below maps the dimensions that actually change between tiers.

### Full Comparison Table

| Factor | Community Edition (Free) | Cloud Starter | Cloud Pro | Enterprise |
|---|---|---|---|---|
| **Monthly cost** | $0 license + $6-20 infra | ~$20 (annual) | ~$50 (annual) | Custom ($500+) |
| **Executions/month** | Unlimited | 2,500 | 10,000 | Custom |
| **Active workflows** | Unlimited | 5 | 15 | Unlimited |
| **User seats** | Unlimited | 2 | 5 | Custom |
| **Integration nodes** | All 400+ | All 400+ | All 400+ | All 400+ |
| **AI Agent node** | Included | Included | Included | Included |
| **Setup time** | 4-16 hours | Minutes | Minutes | Days (onboarding) |
| **Ongoing maintenance** | 1-2 hrs/month | None | None | None |
| **Infrastructure SLA** | Your responsibility | Included | Included | Included |
| **SSO / audit logs** | Not included | Not included | Not included | Included |
| **Data sovereignty** | Full control | No | No | Negotiable |
| **Best for** | High volume / compliance | Solo / testing | Small teams | Large enterprise |

The key insight is that the **workflow power is identical across the free and paid tiers** — the same 400+ nodes, the same AI Agent node, the same code extensibility. What changes is who operates the infrastructure and which compliance and support features are bolted on. This is why free n8n is genuinely viable for production: you are not running a crippled version of the product, you are running the full product on your own server.

### How Free n8n Compares to Other Free Automation Tiers

For context, free n8n compares favorably to the free tiers of its closest competitors. Zapier's free plan caps at 100 tasks/month of single-step Zaps — enough for a handful of notifications, not production automation. Make.com's free plan allows 1,000 operations/month but does not permit self-hosting or unlimited executions at any tier. Our [n8n vs Zapier comparison](/ai-tools/n8n-vs-zapier-comparison-guide) covers these architectural differences in detail.

The structural advantage of free n8n is that "unlimited" actually means unlimited — there is no execution or workflow ceiling imposed by n8n, only the physical limits of your server. For teams scaling [AI business automation](/ai-tools/ai-business-automation-guide), that ceiling-free model is what makes self-hosting worth the operational overhead.

**Bottom line:** n8n Community Edition is the most generous "free" tier in the workflow-automation category, provided you can absorb the hosting and maintenance cost. Start on a $6/month VPS, validate your real execution volume for 30-60 days, and only then decide whether to stay self-hosted or move to a managed Cloud plan. Most teams under 10,000 executions/month with technical staff end up self-hosting; most teams without technical staff end up on Cloud Pro.

---

## Take the Next Step

Choosing free self-hosted n8n over a managed Cloud plan is one decision in a broader automation strategy. Whether you are evaluating n8n for the first time, migrating off Zapier or Make, or scaling an existing self-hosted deployment, GrowthGear can help you design an automation stack that fits your team's capacity and growth plans.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Sources & References

1. [n8n Pricing](https://n8n.io/pricing) — Official Cloud plan tiers, execution limits, and Community Edition license terms (2025)
2. [n8n Documentation](https://docs.n8n.io/) — Node library, AI Agent node, self-hosting setup, and integration catalog (2025)
3. [n8n GitHub Repository](https://github.com/n8n-io/n8n) — Community Edition source, license, and release changelog (2025)
