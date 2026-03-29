---
title: "n8n Pricing: Cloud vs Self-Hosted Cost Guide"
description: "Compare n8n cloud pricing plans vs self-hosting costs in 2026. Starter, Pro, and Enterprise tiers explained with real total cost of ownership analysis."
category: "ai-tools"
author:
  name: "GrowthGear Team"
publishedAt: 2026-03-30
image:
  src: "/images/n8n-pricing-cloud-vs-self-hosted-guide.webp"
  alt: "n8n pricing cloud vs self-hosted cost comparison — abstract gradient workflow tiers"
tags:
  - n8n
  - workflow-automation
  - pricing
  - ai-tools
faq:
  - question: "How much does n8n cloud cost?"
    answer: "n8n Cloud starts at ~$20/month (annual) for Starter: 2,500 executions, 5 active workflows. Pro costs ~$50/month with 10,000 executions. Enterprise pricing is custom-quoted."
  - question: "Is n8n free to self-host?"
    answer: "n8n community edition is free to self-host. You pay only for server infrastructure — typically $6-20/month for a VPS — plus time to set up and maintain the instance."
  - question: "What counts as an n8n execution?"
    answer: "Each workflow run counts as one execution, regardless of node count. A workflow triggered 100 times daily generates ~3,000 executions/month, pushing Starter users toward Pro."
  - question: "How does n8n pricing compare to Zapier?"
    answer: "n8n Cloud Pro at ~$50/month offers 10,000 executions. Comparable Zapier plans start at $69-99/month. Self-hosted n8n under $20/month makes it significantly cheaper at scale."
  - question: "Can I switch from n8n Cloud to self-hosted?"
    answer: "Yes. Export your n8n workflows as JSON from Cloud, then import them into your self-hosted instance. Most workflows migrate without modification in under an hour."
  - question: "Does n8n charge per workflow or per execution?"
    answer: "n8n Cloud charges per execution (workflow run). Plans also cap active workflows: Starter allows 5, Pro allows 15. Self-hosted n8n has no execution or workflow limits."
  - question: "What is n8n Enterprise pricing?"
    answer: "n8n Enterprise is custom-quoted. Most teams report starting prices of $500+/month, varying by execution volume, user count, and features like SSO and audit logging."
keyTakeaways:
  - "n8n Cloud Starter costs ~$20/month (annual billing) — covers 2,500 executions and 5 active workflows, suited for individuals and small teams starting out."
  - "Self-hosting n8n is license-free but adds $6-20/month in VPS costs plus 4-16 hours of initial setup — break-even vs Cloud Pro is roughly 2-3 months of subscription savings."
  - "Teams consistently exceeding 10,000 executions/month save 60%+ by self-hosting instead of upgrading to n8n Enterprise's custom pricing tier."
  - "Execution optimization — batching, early filters, combining workflows — reduces billable Cloud executions by 30-45% in most real-world setups."
callout:
  variant: "warning"
  title: "Watch the Execution Limits"
  content: "n8n Cloud plans charge by execution count. A workflow triggered 100 times daily uses 3,000+ executions/month — enough to push Starter users to Pro within weeks."
---

Choosing between n8n Cloud and self-hosting comes down to one core trade-off: pay more money (Cloud) or invest more time (self-hosted). n8n Cloud starts at approximately **$20/month** for the Starter plan, scaling to **$50/month** for Pro and custom pricing for Enterprise. Self-hosting carries a $0 license cost but requires a server ($6-20/month) and developer setup time. For most small teams, the break-even point falls at **6-12 months** of Cloud subscription savings.

This guide breaks down every n8n pricing tier, the real total cost of ownership for self-hosting (including the hidden costs most comparisons ignore), and a decision framework to help you choose the right deployment model for your team size and automation volume.

### How We Evaluated

We analyzed n8n's public pricing documentation, execution-based billing mechanics, and community-reported infrastructure costs to map total cost of ownership across different team sizes and automation volumes. This evaluation targets teams running 500–50,000 executions per month — the range where the Cloud vs. self-hosted decision has the most financial impact.

## n8n Cloud Pricing Plans Compared

n8n Cloud pricing follows an execution-based model where each complete workflow run counts as one billable execution. The three main tiers serve distinct use cases, and understanding the limits before you need them prevents costly mid-month surprises.

According to [n8n's official pricing page](https://n8n.io/pricing), plans are structured around monthly execution volume, active workflow limits, and user seats. Annual billing reduces costs by roughly 17% versus monthly billing across all tiers.

### Starter Plan: For Individuals and Side Projects

The n8n Cloud Starter plan costs approximately **$20/month on annual billing** ($24/month billed monthly). It includes:

- **2,500 workflow executions per month**
- **5 active workflows** (paused workflows don't count toward the cap)
- **2 user seats**
- Community-level support

Starter suits solopreneurs, freelancers, and teams testing n8n for the first time. If you're automating 1-2 core processes — syncing CRM contacts to Slack, routing support tickets, or pushing form submissions to a spreadsheet — Starter handles it comfortably.

Where it breaks down: a scheduled workflow running every 15 minutes across an 8-hour workday consumes roughly **1,440 executions per month**. Add two such automations and you've hit the ceiling. Most teams doing real business automation reach the Starter limit within 30-60 days of regular use.

### Pro Plan: The Most Common Choice for Growing Teams

The Pro plan runs approximately **$50/month (annual)** or $60/month on monthly billing. It provides:

- **10,000 workflow executions per month**
- **15 active workflows**
- **5 user seats**
- Priority support
- Advanced debugging tools (execution inspector, error workflows)

Pro is where most small-to-medium businesses land for sustainable automation. The [n8n community forum](https://community.n8n.io) suggests the Pro tier covers the majority of paid cloud subscribers.

A useful benchmark: at 10,000 executions, you can run hourly automations across 10 active workflows without approaching the ceiling. A daily report workflow that triggers every hour generates ~720 executions per month. Pro supports roughly 13 such workflows running simultaneously before overage concerns arise.

> **Common mistake:** Don't plan your n8n tier based solely on workflow count. The execution ceiling hits most teams before the active workflow cap in real-world deployments.

### Enterprise: Custom Pricing for High-Volume Operations

n8n Enterprise doesn't publish public pricing. Based on community-reported benchmarks shared on the [n8n community forum](https://community.n8n.io), enterprise quotes typically start around **$500–1,000/month**, scaling based on:

- Custom execution volumes (100,000+/month)
- Unlimited active workflows
- User seats beyond the Pro tier
- Advanced security features: SSO, audit logs, role-based access control
- Dedicated customer success support

Enterprise is cost-justified when you're running critical automation at volume — 500+ workflows across 20+ team members, compliance requirements, or multi-environment deployments. For most teams under that threshold, the jump from Pro to Enterprise is rarely the most cost-effective path forward. Self-hosting typically becomes the smarter alternative before you hit enterprise-level usage.

> **Ready to build an AI automation stack for your business?** GrowthGear's team has helped 50+ startups integrate workflow automation that delivers measurable results. [Book a Free Strategy Session](https://growthgear.com.au) to discuss your n8n architecture.

## What Self-Hosting n8n Actually Costs

Self-hosting n8n's community edition carries a $0 license cost for most commercial use cases. But license-free isn't cost-free. The true total cost of ownership includes server infrastructure, initial setup time, and ongoing maintenance — figures that most "n8n is free to self-host" guides conveniently omit.

### Infrastructure Requirements and Pricing

The minimum viable n8n self-hosted setup depends on your execution volume:

- **1 vCPU, 1GB RAM** — light automation under 500 executions/day, SQLite database
- **2 vCPU, 2GB RAM** — moderate use, 500–5,000 executions/day, PostgreSQL recommended
- **4+ vCPU, 4GB RAM** — production workloads exceeding 5,000 executions/day

Typical VPS costs across major providers:

| Provider | 2 vCPU / 2GB RAM | 4 vCPU / 4GB RAM | Notes |
|---|---|---|---|
| Hetzner Cloud (EU) | ~$5/month | ~$10/month | Best price-to-performance for EU teams |
| DigitalOcean | ~$12/month | ~$24/month | Strong US/global coverage |
| AWS EC2 (t3.small) | ~$15/month | ~$30/month | Best for AWS-native stacks |
| Fly.io | ~$7/month | ~$14/month | Good for containerized deployments |
| Render | ~$7/month | ~$15/month | Managed containers, minimal ops overhead |

For most small teams, a **Hetzner or DigitalOcean VPS** in the $6-12/month range handles n8n comfortably. A production-grade setup also needs a PostgreSQL database — either bundled on the same server or $5-10/month on a managed database service.

**Estimated monthly infrastructure cost: $10–25/month** for a reliable self-hosted n8n instance.

### Hidden Costs: Developer Time and Maintenance

Infrastructure is the easy part to calculate. Developer time is where self-hosted cost estimates typically go wrong:

- **Initial setup**: 2-4 hours for a basic Docker deployment; 8-16 hours for production setup with SSL, automated backups, monitoring, and PostgreSQL
- **Ongoing maintenance**: 1-2 hours/month for version updates, security patches, and routine troubleshooting
- **Major incidents**: n8n version upgrades occasionally introduce breaking changes for existing workflows. Based on n8n's changelog history, this happens roughly 3-4 times per year and may require 1-2 hours of workflow fixes per event

At a conservative $100/hour developer rate, initial setup costs $200–400, with $100–200/month in ongoing time investment. Factoring this in, self-hosting only makes financial sense compared to Pro when your automation volume genuinely exceeds what Pro supports.

### What Teams Running Self-Hosted n8n Report

Business teams running self-hosted n8n consistently highlight two patterns.

Teams processing fewer than 5,000 executions per month typically find the overhead isn't worth it — the $50/month Pro plan is simpler and cheaper when developer hours are counted. The arithmetic changes sharply above 15,000-20,000 executions/month, where self-hosting infrastructure saves hundreds of dollars monthly compared to Cloud overages or Enterprise pricing.

The most frequently cited pain point: webhook reliability during server downtime. Unlike n8n Cloud, which provides infrastructure SLAs, self-hosted instances require deliberate redundancy planning. Teams processing critical production automations should factor in either high-availability configuration (additional complexity) or accept that brief server maintenance windows will interrupt webhook-triggered workflows.

## n8n Cloud vs Self-Hosted: Decision Framework

Neither deployment is universally better. The right choice depends on your team's technical capacity, execution volume, and data requirements. Here's how to make the call without overcomplicating it.

### Choose n8n Cloud If...

Cloud is the right deployment when:

- **Your team lacks DevOps capacity** — Cloud eliminates all server management
- **You run under 10,000 executions/month** — Pro at $50/month is cheaper than developer time for self-hosting when setup costs are amortized
- **Uptime SLAs matter** — n8n Cloud provides infrastructure reliability guarantees self-hosting can't match without significant extra effort
- **You're still evaluating n8n** — the 14-day free trial lets you test real workflows without committing to infrastructure
- **Data sovereignty isn't required** — Cloud stores workflow data and execution logs on n8n's infrastructure

For teams [using AI to automate business tasks](/ai-tools/how-to-use-ai-to-automate-tasks-complete-guide), Cloud's managed environment means focusing on building automation logic rather than managing servers. Pair n8n workflows with [AI tools for marketing automation](https://marketing.growthgear.com.au/content-marketing/best-ai-tools-digital-marketing-automation) and you can build sophisticated content pipelines without any infrastructure concerns.

### Choose Self-Hosted If...

Self-hosting wins when:

- **You process 20,000+ executions/month** — at this volume, self-hosting saves $200–500+/month versus Cloud Pro overages or Enterprise pricing
- **Data sovereignty is required** — healthcare, finance, and legal teams typically cannot send workflow data and execution logs to third-party cloud infrastructure
- **You have existing DevOps infrastructure** — adding n8n to an existing Kubernetes or Docker environment is marginal additional overhead
- **You need unlimited workflows** — self-hosted has no active workflow caps, making it the right choice for large multi-process automation architectures
- **You're serving multiple clients** — the [best n8n workflow templates](/ai-tools/best-n8n-templates-ai-automation-workflows) are portable across self-hosted instances with no per-client licensing fees

From a purely financial perspective, self-hosting becomes superior at roughly **15,000–20,000 executions/month** once realistic developer time costs are included. Below that threshold, the Pro plan wins on total cost of ownership for most teams.

---

## Take the Next Step

Choosing between n8n Cloud and self-hosting is one decision in a broader automation strategy. Whether you're evaluating n8n for the first time or scaling an existing workflow infrastructure, GrowthGear can help you design an automation stack that fits your team's capacity and growth plans.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Reducing Your n8n Costs Without Compromising Workflows

Regardless of which deployment you choose, smart workflow design significantly reduces your execution count — cutting Cloud plan costs and server load for self-hosted setups alike.

### Optimizing Execution Count on Cloud Plans

Execution count is the primary cost driver in n8n Cloud pricing. Four tactics reliably reduce your monthly execution volume:

**1. Add Filter nodes before expensive operations.** If a workflow triggers on every CRM update but only needs to act when the deal status changes to "Closed Won," add a Filter node immediately after the trigger. This stops downstream processing — and execution count — for irrelevant triggers.

**2. Batch operations instead of per-record triggers.** Rather than triggering once per new record (e.g., each new contact added), use a scheduled trigger to process batches every hour. Processing 100 contacts in one execution uses 1 execution instead of 100.

**3. Consolidate related workflows.** Two workflows sharing the same trigger can often be merged into one. This halves execution count while also improving maintainability — a single workflow to debug instead of two.

**4. Deactivate workflows not in active use.** n8n charges for executions from active workflows. Test and staging workflows that remain active will consume your monthly allocation even when you're not intentionally running them.

Teams that consistently apply these four techniques typically see meaningful reductions in monthly execution count — sometimes enough to stay on Starter or avoid upgrading from Pro to Enterprise.

One additional tactic worth implementing early: **use n8n's built-in error handling** rather than wrapping every node in a try-catch pattern. Workflows that fail mid-execution still count as complete executions in n8n's billing. A well-structured error workflow that catches and logs failures in one place is both more maintainable and prevents retry loops from consuming extra executions unexpectedly.

### Choosing the Right Billing Cycle

Annual billing saves approximately **17-20%** across all n8n Cloud tiers. At the Pro level, that's roughly **$120/year** in savings for the same functionality. For teams certain about their automation volume, annual billing is the simplest cost reduction available — no workflow changes required, no execution optimization needed, just a billing cycle switch.

The main risk: you're locked into a plan tier for 12 months. Recommendation is to run monthly billing for the first 60-90 days, optimize your execution patterns, and then switch to annual billing once you've confirmed your steady-state tier. This avoids overpaying on a higher annual plan while you're still learning your automation's actual execution footprint.

### When to Upgrade vs. When to Self-Host

When your execution count consistently exceeds 8,000/month — 80% of the Pro capacity — you face a real decision point. The options:

| Option | Monthly Cost | Setup Time | Monthly Maintenance |
|---|---|---|---|
| Upgrade to Enterprise | $500+/month (custom) | Days (negotiation + onboarding) | None |
| Self-host on Hetzner/DO | $8-15/month + dev time | 4-8 hours | 1-2 hours |
| Self-host on AWS | $15-30/month + dev time | 4-8 hours | 1-2 hours |
| Stay on Pro + optimize | $50/month | 2-4 hours (optimization work) | None |

For most teams hitting the Pro ceiling, **self-hosting on an affordable VPS is the financially dominant choice** — even after accounting for setup and maintenance time. The clear exception: teams without any technical staff, where the simplicity of the $50/month Pro subscription is worth far more than the infrastructure savings.

n8n integrates cleanly with [AI productivity tools](/ai-tools/best-ai-productivity-tools-for-business) and can serve as the automation backbone connecting CRM, email, data warehouse, and content systems. When building out your [AI business solutions](/ai-tools/ai-business-solutions-guide) stack, n8n's total cost — whether Cloud or self-hosted — is typically a small fraction of the value it delivers through automated workflows.

For teams evaluating n8n against alternatives: our [Zapier pricing breakdown](/ai-tools/zapier-cost-pricing-guide) covers comparable cost data — Zapier Professional runs $69-99/month for similar execution volumes, making n8n roughly 30-40% cheaper at the Cloud level, and dramatically cheaper when self-hosting. Teams using [CRM platforms](https://sales.growthgear.com.au/crm-tools/best-crm-software-small-business-teams) alongside n8n should also factor in the value of direct two-way integrations, which both Cloud and self-hosted n8n support natively.

## n8n Pricing: Full Comparison Table

| Factor | Cloud Starter | Cloud Pro | Self-Hosted | Cloud Enterprise |
|---|---|---|---|---|
| **Monthly cost** | ~$20 (annual) | ~$50 (annual) | $0 license + $6-20 infra | Custom ($500+) |
| **Executions/month** | 2,500 | 10,000 | Unlimited | Custom |
| **Active workflows** | 5 | 15 | Unlimited | Unlimited |
| **User seats** | 2 | 5 | Unlimited | Custom |
| **Setup time** | Minutes | Minutes | 4-16 hours | Days (onboarding) |
| **Ongoing maintenance** | None | None | 1-2 hrs/month | None |
| **Infrastructure SLA** | Included | Included | Your responsibility | Included |
| **Data sovereignty** | No | No | Yes | Negotiable |
| **Best for** | Solo / testing | Small teams | High volume / compliance | Large enterprise |

**Bottom line:** n8n Cloud Pro at ~$50/month is the right starting point for most business teams. Move to self-hosting when you consistently exceed 10,000 executions/month and have the technical capacity to manage a VPS. Consider Enterprise only when compliance, SSO, or audit requirements make managed infrastructure non-negotiable. Whichever path you choose, the execution optimization tactics above apply — reducing your monthly execution count by even 20-30% has a compounding positive effect on your total automation costs over a 12-month period.

## Sources & References

1. [n8n Pricing](https://n8n.io/pricing) — Official Cloud plan tiers, execution limits, and user seat allocations (2025)
2. [n8n Community Forum](https://community.n8n.io) — Community-reported Enterprise pricing benchmarks and self-hosting cost estimates across infrastructure providers (2024-2025)
3. [Hetzner Cloud Pricing](https://www.hetzner.com/cloud) — VPS infrastructure pricing used for self-hosted cost benchmarks (2025)
4. [Zapier Pricing](https://zapier.com/pricing) — Competitor pricing data used for cost comparison analysis (2025)
