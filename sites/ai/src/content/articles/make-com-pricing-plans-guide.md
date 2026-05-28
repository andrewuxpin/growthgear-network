---
title: "Make.com Pricing: Plans, Costs & Best Value"
description: "Make.com pricing explained: all five plan tiers, how operations are counted, annual savings, and how to calculate your real monthly bill before you commit."
category: "ai-tools"
author:
  name: "Andrew Martin"
publishedAt: 2026-05-18
image:
  src: "/images/make-com-pricing-plans-guide.webp"
  alt: "Make.com pricing plans — isometric 3D render of stacked tier levels with workflow nodes in blue and purple"
tags:
  - make-com
  - automation
  - pricing
  - workflow
  - no-code
faq:
  - question: "How much does Make.com cost per month?"
    answer: "Make.com costs $0 (Free), $9/month (Core, annual), $16/month (Pro, annual), or $29/month (Teams, annual). Enterprise pricing is custom-quoted. Monthly billing costs roughly 17% more than annual."
  - question: "What counts as an operation in Make.com?"
    answer: "Each module run in a scenario counts as one operation. A 4-module scenario triggered 500 times/month consumes 2,000 operations. Trigger modules, action modules, and error handlers all count."
  - question: "Is Make.com free to use?"
    answer: "Yes. Make.com's free plan includes 1,000 operations/month and 2 active scenarios, with a 15-minute minimum scheduling interval. It covers basic automations for solo users testing the platform."
  - question: "Is Make.com cheaper than Zapier?"
    answer: "Yes, for complex workflows. Make Core at $9/month gives 10,000 operations vs Zapier Professional at $19.99/month for 750 tasks. For multi-step automations, Make delivers far more volume per dollar."
  - question: "What is the difference between Make.com Core and Pro?"
    answer: "Core ($9/month) provides 10,000 operations and 1-minute scheduling. Pro ($16/month) adds DataStore access, higher data transfer limits, and priority scenario execution for latency-sensitive workflows."
  - question: "Does Make.com charge for failed scenarios?"
    answer: "No. Make.com only charges operations for successful module runs. If a scenario errors before completing, only the modules that successfully ran before the error consume operations."
  - question: "When should I upgrade from Make.com Core to Pro?"
    answer: "Upgrade to Pro when you need sub-1-minute scheduling intervals, DataStore for persistent data between scenarios, or higher API throughput for workflows processing large data volumes."
keyTakeaways:
  - "Make.com Core at $9/month (annual) delivers 10,000 operations — roughly 13x more automation volume than Zapier's $19.99/month plan at 750 tasks."
  - "Operations count every module run: a 5-module scenario triggered 500 times/month consumes 2,500 operations — always multiply trigger volume × module count before choosing your plan."
  - "Annual billing saves approximately 17% across all paid plans — Core users save $21.60/year versus month-to-month billing."
  - "The Teams plan ($29/month annual) adds multi-user collaboration and shared scenario libraries — the right choice once 2+ people are building and maintaining workflows."
  - "Free plan users get 1,000 operations and 2 active scenarios — enough for 3-5 simple automations when testing Make.com before committing to a paid plan."
callout:
  variant: "warning"
  title: "Don't Undercount Your Operations"
  content: "Multiply your expected monthly trigger count by the number of modules in each scenario. Most teams underestimate by 3-5x on their first billing cycle."
---

Make.com pricing starts at $0 and scales to custom enterprise contracts — but the unit that determines your real cost is the **operation**, not the workflow. Most teams that overspend on Make.com do so because they misunderstand how operations are counted. This guide breaks down every plan tier, shows you how to calculate your actual monthly bill, and tells you exactly when to upgrade.

## Make.com Pricing Plans at a Glance

Make.com offers five plan tiers: Free, Core, Pro, Teams, and Enterprise. Paid plans are billed annually by default — monthly billing is available at a roughly 17% premium. According to [Make.com's official pricing page](https://www.make.com/en/pricing), the primary cost driver is your monthly operation count, which matters more than plan tier alone.

| Plan | Monthly Cost (Annual) | Monthly Cost (Monthly) | Operations/Month | Active Scenarios | Scheduling Interval |
|------|----------------------|------------------------|------------------|-----------------|---------------------|
| Free | $0 | $0 | 1,000 | 2 | 15 minutes |
| Core | $9 | $10.59 | 10,000 | Unlimited | 1 minute |
| Pro | $16 | $18.82 | 10,000 | Unlimited | 1 minute |
| Teams | $29 | $34.12 | 10,000 | Unlimited | 1 minute |
| Enterprise | Custom | Custom | Custom | Unlimited | 1 minute |

All paid plans include unlimited active scenarios, access to 1,800+ app integrations, and the HTTP module for custom API connections. The main differences between Core, Pro, and Teams are data storage access, scheduling interval, team collaboration features, and data transfer limits.

### Free Plan: What You Actually Get

The Free plan is genuinely useful for solo users validating Make.com before committing. With 1,000 operations/month and 2 active scenarios, you can automate three to five simple two-module workflows — for example, syncing new HubSpot contacts to a Google Sheet and sending a Slack notification when a form is completed.

The 15-minute minimum scheduling interval is the biggest constraint. If your workflows need to run every minute — monitoring a webhook feed or processing time-sensitive data — you'll need Core from day one.

### Core Plan: The Most Popular Choice

Core at $9/month (annual) is Make.com's best-value plan for individuals and small teams. The jump from 1,000 to 10,000 operations/month is significant: it's enough to run a 5-module workflow 2,000 times monthly, which covers most small-business automation needs.

The 1-minute scheduling interval unlocks real-time-ish automation — polling a feed every minute, syncing CRM data as it changes, or processing form submissions within seconds of receipt. Most businesses running 5-20 automated workflows comfortably fit within the Core plan.

### Pro Plan: For Data-Intensive Workflows

Pro adds three capabilities not available on Core: **DataStore access**, higher data transfer limits, and priority execution. DataStore is Make.com's built-in key-value database — it lets scenarios read and write persistent data between runs without requiring an external database. This is valuable for workflows that need to track state: "has this lead been emailed before?", "what was the last invoice number processed?", or "which records have already been synced?".

If you don't need DataStore or aren't running workflows that are latency-sensitive enough to need priority queuing, Core is sufficient. Upgrade to Pro when you hit DataStore use cases or find Core scenarios queuing behind other users' workloads.

### Teams Plan: Multi-User Collaboration

Teams at $29/month (annual) introduces shared workspaces, team role management, and shared scenario libraries. Up to three users can collaborate on the same organization, with admin controls over who can edit versus view each scenario.

For GrowthGear's clients managing marketing automation, CRM syncs, and reporting workflows, the Teams plan typically becomes necessary once a second team member starts building scenarios. The shared template library alone saves significant rebuild time when onboarding new automation workflows.

> **Ready to implement automation in your business?** GrowthGear's team has helped 50+ startups build Make.com workflows that reduce manual work by 80%+. [Book a Free Strategy Session](https://growthgear.com.au) to review your automation stack.

## How Make.com Operations Are Counted

Make.com's operation model is the most important concept to understand before choosing a plan — and the one most teams get wrong the first time. An operation is counted every time a module processes a bundle of data: one email received, one row read, one API response handled. Every module in your scenario charges one operation per bundle, regardless of whether it's a trigger, action, router, or error handler.

### Operation Counting in Practice

Consider a lead capture workflow:
1. Typeform (trigger) — new form submission received
2. HubSpot (create contact) — contact created in CRM
3. Slack (notify) — message sent to #new-leads channel
4. Google Sheets (append row) — lead logged in spreadsheet

This scenario has **4 modules**. Each form submission triggers all 4 modules, consuming **4 operations**. If you receive 500 form submissions per month, this single scenario consumes 2,000 operations.

Add an email enrichment step and a second Slack notification, and that same 500-submission volume now costs 3,000 operations (6 modules × 500 runs).

### How This Differs from Zapier's Task Model

Zapier charges per **task**: each successful action step (not trigger) counts as one task. For the same 4-module scenario above, Zapier would charge 3 tasks per run (the 3 action modules, not the trigger), consuming 1,500 tasks for 500 form submissions.

The critical difference: Make.com's operations include the trigger module; Zapier's tasks do not. For simple 2-module Zaps (trigger + one action), Zapier charges slightly less per run. For 5+ module workflows, Make.com's 10,000-operation Core plan typically delivers significantly more volume than Zapier's 750-task Professional plan for the same monthly spend.

### Common Operation Counting Mistakes

**Iterators and aggregators**: An Iterator module splits an array into individual bundles. If you iterate 50 items and pass each through 3 downstream modules, that's 1 (trigger) + 1 (iterator) + 150 (3 modules × 50 items) = 152 operations per run — not 4. Plan for array processing carefully.

**Error handlers**: If you add a Catch Error route with a Slack alert module, that module only fires (and charges an operation) when an error occurs. In normal operation, it adds nothing to your count.

**Scheduled polling**: If your scenario polls an RSS feed every minute and there are no new items, Make.com does NOT charge an operation — only successful data processing counts. An empty poll consumes zero operations.

## Which Make.com Plan Fits Your Team?

The right Make.com plan depends on three variables: your estimated monthly operation volume, the number of people building and maintaining scenarios, and whether you need DataStore for persisting data between workflow runs. For most solo users running under 20 active workflows at moderate trigger volumes, Core at $9/month provides sufficient headroom for 12-18 months of growth.

### Calculate Your Operation Budget

Use this formula before selecting a plan:

**Monthly operations = Sum of (trigger volume × module count) across all active scenarios**

| Use Case | Modules | Monthly Triggers | Operations/Month |
|----------|---------|-----------------|-----------------|
| Lead-to-CRM sync | 4 | 500 | 2,000 |
| Invoice processing | 6 | 300 | 1,800 |
| Social post scheduling | 3 | 200 | 600 |
| Weekly report generation | 8 | 4 | 32 |
| Support ticket routing | 5 | 1,000 | 5,000 |
| **Total** | — | — | **9,432** |

This example team is approaching the Core plan's 10,000-operation ceiling. Adding two new workflows or a spike in lead volume would push them to the Pro plan or require an operation top-up.

### Plan Selection Framework

| Team Profile | Recommended Plan |
|-------------|-----------------|
| Solo user, 1-5 simple workflows, <1,000 triggers/month | Free |
| Solo user or small team, 5-20 workflows, complex multi-step | Core |
| Data-intensive workflows, needs DataStore or sub-second latency | Pro |
| 2+ scenario builders, shared workspace needed | Teams |
| >100,000 operations/month, SLA requirements, dedicated infrastructure | Enterprise |

### When Core Is Enough

The Core plan handles the vast majority of SMB automation needs. If you're running marketing automation (CRM sync, email triggers, lead routing), operational workflows (invoice processing, form handling, report generation), and light data transformation, Core's 10,000 monthly operations covers teams running 15-30 active scenarios at moderate volume.

According to McKinsey's State of AI 2024 report, 65% of organisations now use AI in at least one business function — and for most of those implementing workflow automation, the Core plan provides sufficient capacity for the first 12-18 months before a volume-driven upgrade becomes necessary.

## Make.com vs Zapier vs n8n: Pricing Head-to-Head

For teams evaluating which automation platform to standardise on, pricing is often the deciding factor alongside workflow complexity and integration depth. Make.com Core at $9/month delivers 10,000 operations — versus Zapier's $19.99/month for 750 tasks and n8n Cloud's ~$20/month for 2,500 executions. For a detailed feature comparison beyond pricing, see our [Make vs Zapier comparison guide](/ai-tools/make-vs-zapier-comparison-guide).

| Platform | Entry Price | Volume at Entry Price | Unit Definition | Self-Hosted | Team Users |
|----------|------------|----------------------|-----------------|-------------|-----------|
| Make.com Core | $9/mo (annual) | 10,000 operations | Per module run | No | 1 |
| Zapier Professional | $19.99/mo (annual) | 750 tasks | Per action step | No | 1 |
| n8n Cloud Starter | ~$20/mo (annual) | 2,500 executions | Per workflow run | Yes | 1 |
| n8n Self-hosted | $6–20/mo (VPS) | Unlimited | Unlimited | Yes | Unlimited |

For the full Zapier pricing breakdown see our [Zapier pricing guide](/ai-tools/zapier-cost-pricing-guide), and for n8n's cloud vs self-hosted cost analysis see our [n8n pricing guide](/ai-tools/n8n-pricing-cloud-vs-self-hosted-guide).

### What Business Owners Are Saying

Business owners evaluating Make.com vs competitors consistently report that the operations model requires an adjustment period but ultimately delivers more value for complex workflows. Teams that ran multi-step Zapier Zaps — particularly those with 4+ action steps — typically find their operation costs lower on Make.com despite the different counting mechanism.

The most common criticism is around the learning curve for estimating operation counts when initially planning workflows. Teams that underplan their operation budget often hit limits mid-month and face paused scenarios until the billing cycle resets or they purchase additional operations ($9 per 10,000 extra operations).

Teams using Make.com for [AI-powered marketing automation](https://marketing.growthgear.com.au/content-marketing/best-ai-tools-digital-marketing-automation) — integrating OpenAI for content classification or HubSpot for lead scoring — report that the per-operation model scales predictably once they understand the module count per workflow.

### The n8n Self-Hosting Alternative

If your team has development capacity and prioritises unlimited volume at low cost, n8n's self-hosted community edition is free software with no operation limits. A VPS running n8n costs $6-20/month depending on specs. The tradeoff: you manage infrastructure, updates, and uptime yourself.

Most non-technical teams find Make.com's managed infrastructure worth the cost. Technical teams running high-volume data pipelines (100,000+ operations/month) often switch to self-hosted n8n where Make.com's operation costs would otherwise exceed $90/month in top-ups alone.

## Make.com Total Cost of Ownership

The sticker price on any Make.com plan only tells part of the story. Your true annual cost includes operation top-ups when you exceed plan limits, team time for building and maintaining scenarios, any migration costs if you're switching from another tool, and the opportunity cost of paused workflows when limits are hit. For most Core plan teams, all-in annual spend stays under $200.

### Annual Billing Savings

Make.com's annual billing discount is consistent across plans:

| Plan | Monthly Billing | Annual Billing | Annual Savings |
|------|----------------|---------------|----------------|
| Core | $10.59/mo | $9.00/mo | $21.60/year |
| Pro | $18.82/mo | $16.00/mo | $33.84/year |
| Teams | $34.12/mo | $29.00/mo | $61.44/year |

The savings are modest at the lower tiers. The stronger argument for annual commitment is budget predictability — locking in your automation cost for 12 months simplifies financial planning for growing teams.

### Operation Top-Ups

When you exceed your monthly operation limit, Make.com pauses affected scenarios until the cycle resets (or until you purchase additional operations). Top-up pricing: $9 per 10,000 additional operations, regardless of plan.

If you're regularly purchasing top-ups, compare the cost of upgrading your plan. Moving from Core to Pro costs $7/month more (annual) and doesn't increase your base 10,000-operation allocation — Pro's advantages are features, not volume. If you need more operations, you'll need to purchase top-ups on any plan until Enterprise custom negotiation becomes available.

### Migration Costs from Zapier

Teams migrating from Zapier to Make.com should budget 2-8 hours per complex Zap to rebuild as Make.com scenarios. Simple 2-step Zaps migrate faster; multi-step Zaps with filters, formatters, and conditional paths take longer due to the different UI paradigm.

The [Make.com automation guide](/ai-tools/make-com-automation-guide) covers scenario building from scratch. For teams evaluating whether migration ROI justifies the effort, calculate your current Zapier task costs versus projected Make.com operation costs at your actual workflow complexity.

### Hidden Cost: Polling vs Webhooks

Make.com scenarios trigger via scheduled polling or real-time webhooks. Polling-triggered scenarios check for new data on your chosen interval (1, 5, or 15 minutes). Crucially, Make.com only charges operations when data is actually processed — an empty poll that finds no new records consumes zero operations. For near-real-time automation, webhooks fire instantly when data arrives and process only genuine events, making them the most operation-efficient trigger type.

For teams integrating Make.com with CRM tools to support [sales pipeline automation](https://sales.growthgear.com.au/crm-tools/best-crm-software-small-business-teams), webhook-triggered scenarios ensure new lead notifications and CRM updates happen in seconds rather than minutes.

### ROI Calculation Framework

Automation ROI is simple to calculate but rarely done before signing up. Use this formula:

**Monthly ROI = (Hours saved × Hourly cost) − Monthly tool cost**

Example: A 4-person ops team automating invoice processing (2 hours/day saved at $35/hour blended):
- Hours saved/month: 40 hours
- Labour cost saved: $1,400/month
- Make.com Pro plan: $16/month
- **Net ROI: $1,384/month**

Even at Enterprise pricing ($200-500/month), automation ROI is typically 5-15x the tool cost for operations-heavy teams. For a worked example with more process types, our [AI automation agency guide](/ai-tools/what-is-an-ai-automation-agency-guide) covers ROI modelling for five common workflow categories.

If you're looking to understand how to maximise [conversion rates through automation-powered lead nurturing](https://marketing.growthgear.com.au/seo/conversion-rate-optimization-strategy-guide), automation ROI compounds when workflows directly impact revenue-generating processes.

## Make.com Pricing Summary

Use this reference table to compare Make.com plan features at a glance before selecting a tier. All paid plans share the same 10,000 operations/month base — the differences are DataStore access, scheduling speed, team collaboration, and priority execution. Upgrade decisions should be driven by feature needs, not by a desire to increase operation limits.

| Factor | Free | Core | Pro | Teams | Enterprise |
|--------|------|------|-----|-------|-----------|
| Monthly cost (annual) | $0 | $9 | $16 | $29 | Custom |
| Operations/month | 1,000 | 10,000 | 10,000 | 10,000 | Custom |
| Active scenarios | 2 | Unlimited | Unlimited | Unlimited | Unlimited |
| Scheduling interval | 15 min | 1 min | 1 min | 1 min | 1 min |
| DataStore | No | No | Yes | Yes | Yes |
| Team users | 1 | 1 | 1 | 3 | Custom |
| Operation top-ups | No | $9/10K | $9/10K | $9/10K | Negotiated |
| Priority execution | No | No | Yes | Yes | Yes |

**Choose Free** if you're testing Make.com with 1-2 simple workflows and don't need real-time triggering.

**Choose Core** if you're a solo operator or small team running up to ~15 active workflows at moderate trigger volumes.

**Choose Pro** if you need DataStore, priority execution for latency-sensitive automations, or higher data transfer caps.

**Choose Teams** if two or more people are actively building and maintaining scenarios.

**Contact sales for Enterprise** if you're processing >100,000 operations/month, need a guaranteed SLA, or require dedicated Make.com infrastructure.

---

## Take the Next Step

Choosing the right Make.com plan is the foundation of a scalable automation stack — but the bigger opportunity is designing workflows that compound over time. Whether you're evaluating Make.com for the first time or optimising an existing automation build, GrowthGear's team can help you plan the right workflow architecture for your growth stage.

[Book a Free Strategy Session →](https://growthgear.com.au)

---

## Sources & References

1. [Make.com Pricing](https://www.make.com/en/pricing) — Official Make.com plan tiers, operation limits, and billing details (2026)
2. [Zapier Pricing](https://zapier.com/pricing) — Zapier task limits and plan comparison for competitive benchmarking (2026)
3. [McKinsey State of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) — "65% of organisations use AI in at least one business function" (2024)
4. [Grand View Research: Workflow Management Systems Market](https://www.grandviewresearch.com/industry-analysis/workflow-management-systems-market) — Workflow automation market size and growth projections (2024)
